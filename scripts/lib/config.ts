import 'dotenv/config';

export interface DigestConfig {
  tavilyApiKey: string;
  anthropicApiKey: string;
  replicateApiToken: string;
  today: string; // YYYY-MM-DD
  blogDir: string;
  assetsDir: string;
}

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}. See .env.example`);
  }
  return value;
};

export function loadConfig(): DigestConfig {
  const today = new Date().toISOString().slice(0, 10);

  return {
    tavilyApiKey: required('TAVILY_API_KEY'),
    anthropicApiKey: required('ANTHROPIC_API_KEY'),
    replicateApiToken: required('REPLICATE_API_TOKEN'),
    today,
    blogDir: 'src/content/blog',
    assetsDir: 'src/assets/digest',
  };
}
