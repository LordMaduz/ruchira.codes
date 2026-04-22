# Deployment Guide

## Environment Variables Setup for GitHub Actions

This project uses environment variables that need to be configured in GitHub repository secrets for successful deployment.

### Required GitHub Secrets

Add these secrets in your GitHub repository:

**Repository Settings → Secrets and variables → Actions → New repository secret**

1. **VITE_RESUME_DRIVE_FILE_ID**
   - Description: Google Drive file ID for resume download
   - Current value: `14y2gRU9q6Hv09CBwNA-vA5rDIuix8azP`

2. **VITE_WEB3FORMS_ACCESS_KEY**
   - Description: Web3Forms API key for contact form
   - Current value: `81c30922-1039-4a95-a116-1d9531d82b6a`

### How Environment Variables Work

- **Local Development**: Uses `.env` file (gitignored)
- **GitHub Actions**: Uses repository secrets passed to build step
- **Vite Build**: `VITE_` prefixed variables are embedded at build-time

### Updating Secrets

If you need to update any API keys or secrets:

1. Update `.env` file locally for development
2. Update GitHub repository secrets for deployment
3. Re-run the deployment workflow or push to main branch

### Security Notes

- ✅ `.env` is gitignored (secrets are safe)
- ✅ GitHub secrets are encrypted and not exposed in logs
- ✅ Only environment variables prefixed with `VITE_` are embedded in build
- ⚠️ Built files will contain these values (they're public in the client-side bundle)

### Deployment Workflow

The deployment happens automatically when:
- Code is pushed to `main` branch
- Pull request is merged to `main`
- Manually triggered from Actions tab

### Troubleshooting

**Build fails with undefined environment variables:**
- Verify secrets are added in GitHub repository settings
- Check secret names match exactly (case-sensitive)
- Ensure the workflow file includes the `env:` section in build step

**Contact form not working after deployment:**
- Verify `VITE_WEB3FORMS_ACCESS_KEY` is set correctly
- Check browser console for errors
- Confirm Web3Forms account is active

**Resume download returns 404:**
- Verify `VITE_RESUME_DRIVE_FILE_ID` is correct
- Ensure Google Drive file sharing is set to "Anyone with link"
- Test the download URL directly
