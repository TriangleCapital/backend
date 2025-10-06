import { NextFunction, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { GetSolviaExcelPayload } from '../../database/interfaces/import';
import { getSolviaRealties } from '../services/banks';
import { catchControllerError } from '../../errors/generalError';
import { getSolviaRealtiesFromSimpleRealties, handleExcelRealties } from '../handlers/banks';
import { doserRealties } from '../helpers/realtiesDoser';
import { generateExcelBuffer, parseSolviaRealtyToDb } from '../helpers/bankParsers';
import { getAllOkupaRealties } from '../services/totalum';

export async function getAllSolviaRealties(req: GetSolviaExcelPayload, res: Response, next: NextFunction) {
  try {
    const { postalCodes } = req.body;

    const result = await getSolviaRealties(postalCodes);

    res.status(200).json(result);
  } catch (error) {
    catchControllerError(error, 'Error obteniendo los activos de Solvia en el controlador', req.body, next);
  }
}

export async function updateSolviaRealties(req: GetSolviaExcelPayload, res: Response, next: NextFunction) {
  try {
    const { postalCodes } = req.body;

    const allDbRealties = await getAllOkupaRealties();

    const allSimpleRealties = await getSolviaRealties(postalCodes);
    const allExtendedRealties = await getSolviaRealtiesFromSimpleRealties(allSimpleRealties);

    const result = await doserRealties({
      bankRealties: allExtendedRealties,
      dbRealties: allDbRealties,
      mapFetchedToDb: parseSolviaRealtyToDb,
    });

    const { created, updated, deleted, omitted } = result;

    res.status(200).json(result);
  } catch (error) {
    catchControllerError(error, 'Error actualizando los activos de Solvia en el controlador', req.body, next);
  }
}

type SolviaSimpleRealty = any;
type SolviaRealty = any;

type JobStatus = 'queued' | 'running' | 'done' | 'error';

interface ExcelJob {
  id: string;
  status: JobStatus;
  total: number;
  processed: number;
  startedAt?: number;
  endedAt?: number;
  error?: string;
  filename?: string;
  buffer?: Buffer;
  size?: number;
}

const jobs = new Map<string, ExcelJob>();

export async function startExtendedSolviaExcelJob(req: GetSolviaExcelPayload, res: Response) {
  const id = nanoid();
  const job: ExcelJob = { id, status: 'queued', total: 0, processed: 0 };
  jobs.set(id, job);

  res.status(202).json({ jobId: id });

  (async () => {
    try {
      job.status = 'running';
      job.startedAt = Date.now();

      const { postalCodes } = req.body as any;

      const solviaRealtiesSimple: SolviaSimpleRealty[] = await getSolviaRealties(postalCodes);
      job.total = solviaRealtiesSimple.length;

      const solviaRealties: SolviaRealty[] = await getSolviaRealtiesFromSimpleRealties(solviaRealtiesSimple);

      job.processed = job.total;

      const { buffer, filename } = generateExcelBuffer(solviaRealties);
      job.buffer = buffer;
      job.filename = filename;
      job.size = buffer.length;

      job.status = 'done';
      job.endedAt = Date.now();
    } catch (e: any) {
      job.status = 'error';
      job.error = String(e?.message || e);
      job.endedAt = Date.now();
    }
  })();
}

export function getExtendedSolviaExcelJobStatus(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const job = jobs.get(id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const { buffer, ...meta } = job;
  res.json(meta);
}

export function downloadExtendedSolviaExcelJob(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const job = jobs.get(id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (job.status !== 'done' || !job.buffer) {
    return res.status(425).json({ error: 'Not ready' });
  }

  const filename = job.filename ?? 'activos_solvia.xlsx';
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Length', job.size?.toString() ?? job.buffer.length.toString());
  res.status(200).end(job.buffer);
}

export async function processExcelRealties(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).send(`No se ha recibido ningún archivo.`);
      return;
    }

    const id = nanoid();
    const job: ExcelJob = { id, status: 'queued', total: 0, processed: 0 };
    jobs.set(id, job);

    const alreadyExistentRealtiesIds = await handleExcelRealties(files[0]);

    res.status(202).json({ jobId: id });

    (async () => {
      try {
        job.status = 'running';
        job.startedAt = Date.now();

        const { postalCodes } = req.body as any;

        const solviaRealtiesSimple: SolviaSimpleRealty[] = await getSolviaRealties(postalCodes);
        job.total = solviaRealtiesSimple.length;

        const filteredSolviaSimpleRealties = solviaRealtiesSimple.filter((r) => !alreadyExistentRealtiesIds.includes(r.id));

        const solviaRealties: SolviaRealty[] = await getSolviaRealtiesFromSimpleRealties(filteredSolviaSimpleRealties);

        job.processed = job.total;

        const { buffer, filename } = generateExcelBuffer(solviaRealties);
        job.buffer = buffer;
        job.filename = filename;
        job.size = buffer.length;

        job.status = 'done';
        job.endedAt = Date.now();
      } catch (e: any) {
        job.status = 'error';
        job.error = String(e?.message || e);
        job.endedAt = Date.now();
      }
    })();
  } catch (error) {
    catchControllerError(error, 'Error procesando el excel de inmuebles en el controlador', req.body, next);
  }
}
