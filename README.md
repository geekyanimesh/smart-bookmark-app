Problems & Solutions:

1. OAuth Redirect Mismatch in Production

Problem: Upon deploying to Vercel, the "Continue with Google" flow attempted to redirect users back to localhost:3000 instead of the live production domain, causing a "site cannot be reached" error.

Solution: This was resolved by updating the Site URL and Redirect URIs within the Supabase Authentication dashboard to match the Vercel deployment URL. Additionally, the frontend logic was updated to use window.location.origin to ensure the redirect URI is dynamically generated based on the current environment.

2. Real-time Synchronization Latency

Problem: New bookmarks added in one browser tab did not appear in other active sessions without a manual page refresh, despite the frontend having a real-time listener.

Solution: The issue was tracked to the database replication settings. I enabled the bookmarks table within the supabase_realtime publication and executed a SQL command to set the REPLICA IDENTITY to FULL. This forced the database to broadcast the entire row payload (title, URL, etc.) rather than just the primary key, allowing other tabs to render new items instantly.