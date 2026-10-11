import { allEntries, base } from '../lib/content';
import { readExperimentProjects } from '../lib/experiments.mjs';
export async function GET() {
  return Response.json(readExperimentProjects(await allEntries(),base).map(({attachments,...project}: any) => project));
}
