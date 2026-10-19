# OVIA Frontend - Windows Setup

1. Open this folder (`ovia-frontend`) in VS Code. Make sure the terminal is in the same folder as `package.json`.
2. Close any running Vite terminal.
3. Remove the old `node_modules` folder if it exists. The supplied `package-lock.json` is the clean lockfile for this frontend and does not include the Linux-only `inotify` package.
4. In PowerShell, run:

   ```powershell
   npm ci
   npm run build
   npm run dev
   ```

If `npm ci` says the lockfile and package.json are out of sync, run `npm install` instead. If the same `inotify@1.4.6` EBADPLATFORM error still appears, confirm the terminal path with `Get-Location` and inspect the `package.json` in that exact directory; the install is likely running against a different or old package.json/package-lock.json. `inotify` is Linux-only and should not be added as a dependency for this Windows frontend.

Teacher-specific frontend pages, layout, sidebar, registration option, demo login button, and teacher service have been removed. The user role type still recognizes `teacher` for compatibility with existing API/database records, but no teacher dashboard route is provided.
