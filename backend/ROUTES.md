# Backend API Endpoints

This document lists all available backend endpoints after recent fixes (added generic analytics POST handler and diagnostics endpoint).

## Health
| Method | Path        | Description                | Auth |
|--------|-------------|----------------------------|------|
| GET    | /health     | Basic backend health       | No   |
| GET    | /api/health | Health via API prefix      | No   |

## Public Content
| Method | Path                | Description                     | Auth |
|--------|---------------------|---------------------------------|------|
| GET    | /api/personal-info  | Get personal info (single row)  | No   |
| GET    | /api/projects       | List projects                   | No   |
| GET    | /api/skills         | List skills                     | No   |
| GET    | /api/experiences    | List experiences                | No   |

## Contact
| Method | Path         | Description              | Auth |
|--------|--------------|--------------------------|------|
| POST   | /api/contact | Submit contact form      | No   |

## Analytics
| Method | Path                        | Description                                      | Auth |
|--------|-----------------------------|--------------------------------------------------|------|
| POST   | /api/analytics              | Generic analytics event capture (NEW)            | No   |
| POST   | /api/analytics/page-view    | Explicit page view event                         | No   |
| POST   | /api/analytics/event        | Explicit custom event                            | No   |
| GET    | /api/analytics              | Quick summary: totals + last 5 events (NEW)      | No   |
| GET    | /api/analytics/summary      | Summary by type & page (days param supported)    | No   |
| GET    | /api/analytics/detailed     | Detailed list (pagination & filters)             | No   |

## Admin Authentication
| Method | Path                | Description        | Auth |
|--------|---------------------|--------------------|------|
| POST   | /api/admin/login    | Admin login        | No   |

## Admin - Dashboard
| Method | Path                 | Description             | Auth |
|--------|----------------------|-------------------------|------|
| GET    | /api/admin/dashboard | Dashboard stats overview| Yes  |

## Admin - Projects
| Method | Path                        | Description        | Auth |
|--------|-----------------------------|--------------------|------|
| GET    | /api/admin/projects         | List projects      | Yes  |
| POST   | /api/admin/projects         | Create project     | Yes  |
| PUT    | /api/admin/projects/:id     | Update project     | Yes  |
| DELETE | /api/admin/projects/:id     | Delete project     | Yes  |

## Admin - Skills
| Method | Path                     | Description        | Auth |
|--------|--------------------------|--------------------|------|
| GET    | /api/admin/skills        | List skills        | Yes  |
| POST   | /api/admin/skills        | Create skill       | Yes  |
| PUT    | /api/admin/skills/:id    | Update skill       | Yes  |
| DELETE | /api/admin/skills/:id    | Delete skill       | Yes  |

## Admin - Experiences
| Method | Path                           | Description         | Auth |
|--------|--------------------------------|---------------------|------|
| GET    | /api/admin/experiences         | List experiences    | Yes  |
| POST   | /api/admin/experiences         | Create experience   | Yes  |
| PUT    | /api/admin/experiences/:id     | Update experience   | Yes  |
| DELETE | /api/admin/experiences/:id     | Delete experience   | Yes  |

## Admin - Messages
| Method | Path                              | Description             | Auth |
|--------|-----------------------------------|-------------------------|------|
| GET    | /api/admin/messages               | List messages           | Yes  |
| PUT    | /api/admin/messages/:id/read      | Mark message as read    | Yes  |

## Admin - Personal Info & Settings
| Method | Path                           | Description              | Auth |
|--------|--------------------------------|--------------------------|------|
| GET    | /api/admin/personal-info       | Get personal info        | Yes  |
| PUT    | /api/admin/personal-info       | Update personal info     | Yes  |
| GET    | /api/admin/settings            | Get site settings        | Yes  |
| PUT    | /api/admin/settings            | Update site settings     | Yes  |

## Admin - Resume Upload
| Method | Path                          | Description           | Auth |
|--------|-------------------------------|-----------------------|------|
| POST   | /api/admin/upload/resume      | Upload resume (PDF)   | Yes  |

## Generic Uploads (Cloudinary)
| Method | Path                     | Description        | Auth |
|--------|--------------------------|--------------------|------|
| POST   | /api/uploads/image       | Upload image       | No   |
| POST   | /api/uploads/resume      | Upload resume      | No   |
| DELETE | /api/uploads/image/:id   | Delete image       | No   |

## Diagnostics
| Method | Path             | Description                         | Auth |
|--------|------------------|-------------------------------------|------|
| GET    | /api/_endpoints  | List all API endpoints (diagnostic) | No   |

## Notes
- NEW: Added generic POST `/api/analytics` to eliminate 404s from the frontend's `fetch('/api/analytics')` calls.
- NEW: Added GET `/api/analytics` for a lightweight summary (recent 5 events + counts).
- NEW: Added diagnostic endpoint `/api/_endpoints` to quickly inspect what's deployed.
- The legacy analytics POST handler inside `public.ts` remains for backward compatibility but requests now resolve earlier via the dedicated `analytics` router.

## Testing Locally
Example PowerShell commands (run from `backend` directory in a separate terminal from the running server):
```powershell
# Start server (terminal 1)
npm run dev

# In another terminal (terminal 2)
Invoke-RestMethod -Uri http://localhost:5000/api/_endpoints | ConvertTo-Json -Depth 4
Invoke-RestMethod -Uri http://localhost:5000/api/analytics -Method Post -Body (@{ event_type='diagnostic'; page='/'; } | ConvertTo-Json) -ContentType 'application/json'
Invoke-RestMethod -Uri http://localhost:5000/api/analytics
```

## Deployment Checklist
- Ensure `CORS_ORIGIN` includes production + preview + localhost
- Ensure `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` set in production
- Optionally set `PUBLIC_BASE_URL` for correct absolute URLs in responses
