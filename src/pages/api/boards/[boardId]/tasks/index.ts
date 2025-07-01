import { withAuth } from "@lib/auth";
import { getNotionClientForUser } from '@lib/notion';


export const POST = withAuth(async (userId, context) => {
    const boardId = context.params.boardId!;


    const body = await context.request.json();
    const { name, status, priority, category, startDate, deadline, description } = body;

    if (!name) {
        return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400 });
    }

    try {
        const notion = await getNotionClientForUser(userId, context);
        const response = await notion.pages.create({
            parent: { database_id: boardId },
            properties: {
                Name: {
                    title: [{ text: { content: name } }],
                },
                Status: status
                    ? {
                        status: { name: status },
                    }
                    : undefined,
                Priority: priority
                    ? {
                        select: { name: priority },
                    }
                    : undefined,
                Category: category
                    ? {
                        select: { name: category },
                    }
                    : undefined,
                "Start Date": startDate
                    ? {
                        date: { start: startDate },
                    }
                    : undefined,
                Deadline: deadline
                    ? {
                        date: { start: deadline },
                    }
                    : undefined,
                Description: description
                    ? {
                        rich_text: [{ text: { content: description } }],
                    }
                    : undefined,
            },
        });
        return new Response(JSON.stringify(response), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to create task' }), { status: 500 });
    }
});
