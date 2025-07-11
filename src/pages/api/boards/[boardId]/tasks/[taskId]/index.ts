import { withAuth } from "@lib/auth";
import { getNotionClientForUser } from '@lib/notion';

export const PATCH = withAuth(async (userId, context) => {
    const boardId = context.params.boardId!;
    const taskId = context.params.taskId!;

    if (!taskId) {
        return new Response(JSON.stringify({ error: 'Task ID missing' }), { status: 400 });
    }

    const updates = await context.request.json();

    const properties: Record<string, any> = {};

    if (updates.name) {
        properties.Name = {
            title: [{ text: { content: updates.name } }],
        };
    }
    
    if (updates.status) {
        properties.Status = {
            status: { name: updates.status },
        };
    }
    
    if (updates.priority) {
        properties.Priority = {
            select: { name: updates.priority },
        };
    }

    if (updates.category) {
        properties.Category = {
            select: { name: updates.category },
        };
    }

    if (updates.startDate) {
        properties['Start Date'] = {
            date: { start: updates.startDate },
        };
    }

    if (updates.deadline) {
        properties.Deadline = {
            date: { start: updates.deadline },
        };
    }

    if (updates.description) {
        properties.Description = {
            rich_text: [{ text: { content: updates.description } }],
        };
    }


    if (Object.keys(properties).length === 0) {
        return new Response(JSON.stringify({ error: 'No valid fields to update' }), { status: 400 });
    }

    try {
        const notion = await getNotionClientForUser(userId, context);
        const response = await notion.pages.update({
            page_id: taskId,
            properties,
        });

        return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to update task' }), { status: 500 });
    }
});