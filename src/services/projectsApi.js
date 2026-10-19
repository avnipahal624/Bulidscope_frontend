
const API_BASE = '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Backend request failed (${response.status}): ${message}`
    );
  }

  if (response.status === 204) return null;
  return response.json();
}

export function listBackendProjects() {
  return request('/projects');
}

export function getBackendProject(id) {
  return request(`/projects/${encodeURIComponent(id)}`);
}

export function createBackendProject(project) {
  return request('/projects', {
    method: 'POST',
    body: JSON.stringify({
      name: project.name.trim(),
      description: (
        project.solution ||
        project.problem ||
        project.desiredOutcome ||
        project.name
      ).trim().padEnd(10, ' '),
      problem_statement: project.problem || '',
      target_users: project.targetUsers || [],
      keywords: [
        ...(project.skills || []),
        ...(project.stack || []),
      ],
      planned_features: (project.features || []).map((feature) =>
        typeof feature === 'string' ? feature : feature.name
      ).filter(Boolean),
    }),
  });
}
