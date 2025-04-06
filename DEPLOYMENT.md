# Deployment Guide for PG&E Substation Operations AI Assistant

This guide provides instructions for deploying the PG&E Substation Operations AI Assistant to Render.com, making it accessible to users across different locations.

## Prerequisites

1. A [Render.com](https://render.com/) account
2. A [GitHub](https://github.com/) account with the repository pushed
3. An OpenAI API key (optional, for enhanced AI capabilities)

## Deployment Steps

### 1. Prepare Your Repository

Ensure your repository has the following files configured correctly:
- `render.yaml` - Defines the service configuration for Render
- `package.json` - Contains proper scripts and dependencies
- `Procfile` - For Heroku compatibility (if needed)

These files have already been configured in the latest commit.

### 2. Deploy to Render.com

1. Log in to your [Render Dashboard](https://dashboard.render.com/)
2. Click **New** and select **Blueprint**
3. Connect your GitHub repository
4. Select the repository `PG-E-Substation-Operations-AI-Assistant`
5. Render will detect the `render.yaml` file and configure the services automatically
6. Click **Apply Blueprint**

### 3. Configure Environment Variables

After the blueprint is applied, you'll need to set up environment variables:

1. Navigate to your new web service
2. Go to the **Environment** tab
3. Add the following environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `4477` (Render will automatically assign the correct port)
   - `OPENAI_API_KEY`: Your OpenAI API key (if you want to use OpenAI integration)

### 4. Verify Deployment

Once deployment is complete:

1. Click on the URL provided by Render to open your application
2. Test the application by sending queries about substations
3. Check that the AI Assistant responds correctly

The application should be accessible at: `https://pge-substation-ai-assistant.onrender.com`

## Troubleshooting

If you encounter any issues:

1. Check the **Logs** tab in your Render dashboard
2. Ensure all environment variables are set correctly
3. Verify that the build process completed successfully
4. Check that the server started without errors

## Usage Instructions for Clients

Share these instructions with your clients:

1. Access the PG&E Substation Operations AI Assistant at: `https://pge-substation-ai-assistant.onrender.com`
2. Use the chat interface to ask questions about substation operations
3. Example queries:
   - "What is the health status of transformer T-123?"
   - "Show me safety guidelines for breaker racking"
   - "What are your AI capabilities?"

## Maintenance

To update the application after making changes:

1. Push your changes to GitHub
2. Render will automatically detect the changes and redeploy

## Support

If clients encounter any issues, they can:
1. Refresh the page and try again
2. Clear browser cache if the UI appears broken
3. Contact the administrator if issues persist 