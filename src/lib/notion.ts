import { Client } from '@notionhq/client';
import { clerkClient, type OauthAccessToken } from '@clerk/astro/server';

export async function getNotionClientForUser(userId: string, context: any): Promise<Client> {
  try {
    const notionOauthTokensResponse = await clerkClient(context).users.getUserOauthAccessToken(userId, "notion");
    const tokens: OauthAccessToken[] = notionOauthTokensResponse.data;

    if (!tokens || tokens.length === 0) {
      throw new Error("Notion OAuth token not found for this user.");
    }

    const notionToken = tokens[0].token;
    return new Client({ auth: notionToken });

  } catch (error: any) {
    throw new Error(`Failed to initialize Notion client: ${error.message}`);
  }
}