import { loadAll } from 'js-yaml';
import extractFrontMatter from 'front-matter';
import { Octokit } from '@octokit/rest';
import camelize from './camelize';

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN,
});

const repo = {
  owner: 'oacore',
  repo: 'content',
};

const getExtension = (fileName: string): string => {
  const lastDot = fileName.lastIndexOf('.');
  return lastDot !== -1 ? fileName.slice(lastDot + 1) : '';
};

const getBasename = (fileName: string, ext?: string): string => {
  const lastSlash = Math.max(fileName.lastIndexOf('/'), fileName.lastIndexOf('\\'));
  const name = lastSlash !== -1 ? fileName.slice(lastSlash + 1) : fileName;
  if (ext && name.endsWith(ext)) {
    return name.slice(0, name.length - ext.length);
  }
  return name;
};

const parseId = (fileName: string): string => {
  const ext = getExtension(fileName);
  return getBasename(fileName, ext ? `.${ext}` : undefined);
};

const parseFormat = (fileName: string): string | null => {
  const ext = getExtension(fileName);
  const formatMap: Record<string, string> = {
    md: 'markdown',
    markdown: 'markdown',
    yml: 'yaml',
    yaml: 'yaml',
  };
  return formatMap[ext] || null;
};

interface GithubFile {
  path: string;
  content: string;
  type: string;
  download_url?: string;
}

const processFile = (githubFile: GithubFile): Array<[string, string]> => {
  const content = atob(githubFile.content);
  return [[githubFile.path, content]];
};

const processDirectory = async (githubDirectory: GithubFile[]): Promise<Array<[string, string]>> => {
  const files = githubDirectory.filter(
    (file): file is GithubFile & { download_url: string } =>
      file.type === 'file' && !!file.download_url
  );

  const responses = await Promise.all(
    files.map((file) => octokit.request(`GET ${file.download_url}`))
  );

  return files.map((file, i) => [file.path, responses[i].data as string]);
};

const parseData = (entries: Array<[string, string]>): Array<[string, unknown]> => {
  return entries.map(([fileName, content]) => {
    const format = parseFormat(fileName);
    const id = parseId(fileName);

    if (format === 'yaml') {
      const [data] = loadAll(content);
      return [id, data];
    }

    if (format === 'markdown') {
      const rawData = extractFrontMatter(content);
      const data = {
        ...(typeof rawData.attributes === 'object' && rawData.attributes !== null
          ? (rawData.attributes as Record<string, unknown>)
          : {}),
        body: rawData.body,
      };
      return [id, data];
    }

    return [id, content];
  });
};

interface TransformOptions {
  strategy?: 'auto' | 'object';
  key?: string;
}

const createEntryWithKey = (
  key: string,
  value: unknown,
  targetKey: string
): Record<string, unknown> => {
  return {
    [targetKey]: key,
    ...(typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {}),
  };
};

const transformData = (
  entries: Array<[string, unknown]>,
  { strategy = 'auto', key: targetKey = 'id' }: TransformOptions = {}
): unknown => {
  const processedEntries: Array<[string, unknown]> = entries.map(([key, value]) => [
    key,
    typeof value === 'object' && value !== null ? camelize(value) : value,
  ]);

  if (strategy === 'auto') {
    const autoEntries = processedEntries.map(([key, value]) =>
      createEntryWithKey(key, value, targetKey)
    );
    return autoEntries.length === 1 ? autoEntries[0] : autoEntries;
  }

  if (strategy === 'object') {
    if (processedEntries.length === 1) {
      return createEntryWithKey(processedEntries[0][0], processedEntries[0][1], targetKey);
    }
    return camelize(Object.fromEntries(processedEntries));
  }

  return processedEntries;
};

interface RetrieveContentOptions {
  ref?: string;
  transform?: 'auto' | 'object';
  key?: string;
}

const retrieveContent = async (
  path: string,
  { ref, transform = 'auto', key }: RetrieveContentOptions = {}
): Promise<unknown> => {
  const { data } = await octokit.repos.getContent({
    ...repo,
    path,
    ref,
  });

  const processedData = Array.isArray(data)
    ? await processDirectory(data as GithubFile[])
    : processFile(data as GithubFile);

  const parsedData = parseData(processedData);
  return transformData(parsedData, { strategy: transform, key });
};

export default retrieveContent;
