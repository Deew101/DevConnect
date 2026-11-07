// scripts/fetch_github_data.cjs
// Queries official GitHub REST API for authentic repos and developers
const https = require('https');
const fs = require('fs');
const path = require('path');

const REPOS = [
  'facebook/react',
  'vercel/next.js',
  'supabase/supabase',
  'microsoft/vscode',
  'tailwindlabs/tailwindcss',
  'shadcn-ui/ui',
  'torvalds/linux',
  'rust-lang/rust',
  'golang/go',
  'python/cpython',
  'nodejs/node',
  'denoland/deno',
  'oven-sh/bun',
  'vuejs/core',
  'sveltejs/svelte',
  'flutter/flutter',
  'facebook/react-native',
  'electron/electron',
  'redis/redis',
  'postgres/postgres',
  'docker/cli',
  'kubernetes/kubernetes',
  'grafana/grafana',
  'prometheus/prometheus',
  'tensorflow/tensorflow',
  'pytorch/pytorch',
  'huggingface/transformers',
  'langchain-ai/langchain',
  'anthropics/anthropic-sdk-typescript',
  'expressjs/express',
  'nestjs/nest',
  'fastapi/fastapi',
  'prisma/prisma',
  'drizzle-team/drizzle-orm',
  'trpc/trpc',
  'TanStack/query',
  'framer/motion',
  'lucide-icons/lucide',
  'astral-sh/uv',
  'tauri-apps/tauri',
  'apollographql/apollo-client',
  'vitejs/vite',
  'vitest-dev/vitest',
  'biomejs/biome',
  'vercel/turborepo'
];

const DEVELOPERS = [
  'torvalds',
  'gaearon',
  'yyx990803',
  'rauchg',
  'shadcn',
  'tj',
  'sophiebits',
  'Rich-Harris',
  'mitchellh',
  'addyosmani',
  'paulirish',
  'kentcdodds',
  'sindresorhus',
  'tannerlinsley',
  'mcollina',
  'antfu',
  'swyx',
  'karpathy',
  'tiangolo',
  'developit',
  'brianleroux',
  'leerob',
  'delbaoliveira',
  'bvaughn',
  'gvanrossum',
  'matz',
  'mrdoob',
  'shiffman',
  'kripken',
  'ThePrimeagen'
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'DevConnect-Integration-Agent/1.0',
        'Accept': 'application/vnd.github.v3+json'
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        } else {
          reject(new Error(`GitHub API Error: ${res.statusCode} ${res.statusMessage} on ${url}`));
        }
      });
    }).on('error', reject);
  });
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('Fetching 45 real GitHub repositories...');
  const repoResults = [];
  for (const fullName of REPOS) {
    try {
      const data = await fetchJson(`https://api.github.com/repos/${fullName}`);
      repoResults.push({
        id: `gh-repo-${data.id}`,
        github_id: data.id,
        name: data.name,
        full_name: data.full_name,
        owner: data.owner.login,
        owner_avatar_url: data.owner.avatar_url,
        owner_type: data.owner.type,
        html_url: data.html_url,
        description: data.description || 'Public GitHub open-source repository.',
        language: data.language || 'Multi-language',
        stars: data.stargazers_count,
        forks: data.forks_count,
        open_issues_count: data.open_issues_count,
        topics: data.topics || [],
        created_at: data.created_at,
        updated_at: data.updated_at,
        license: data.license?.name || null
      });
      console.log(`✓ Fetched repo: ${data.full_name} (${data.stargazers_count.toLocaleString()} stars)`);
      await sleep(100); // polite delay
    } catch (err) {
      console.warn(`! Rate limit or error on repo ${fullName}: ${err.message}`);
    }
  }

  console.log(`\nFetching ${DEVELOPERS.length} real public GitHub developers...`);
  const devResults = [];
  for (const username of DEVELOPERS) {
    try {
      const data = await fetchJson(`https://api.github.com/users/${username}`);
      devResults.push({
        id: `gh-user-${data.id}`,
        github_id: data.id,
        username: data.login,
        name: data.name || data.login,
        avatar_url: data.avatar_url,
        bio: data.bio || 'Public open source contributor on GitHub.',
        company: data.company || null,
        location: data.location || null,
        blog: data.blog || null,
        public_repos: data.public_repos,
        public_gists: data.public_gists,
        followers: data.followers,
        following: data.following,
        html_url: data.html_url,
        created_at: data.created_at,
        updated_at: data.updated_at
      });
      console.log(`✓ Fetched developer: ${data.login} (${data.followers.toLocaleString()} followers)`);
      await sleep(100);
    } catch (err) {
      console.warn(`! Rate limit or error on user ${username}: ${err.message}`);
    }
  }

  console.log(`\nSummary: Retreived ${repoResults.length} repos and ${devResults.length} developers.`);
  fs.writeFileSync(path.join(__dirname, 'github_raw_cache.json'), JSON.stringify({
    repos: repoResults,
    developers: devResults
  }, null, 2));
}

main().catch(console.error);
