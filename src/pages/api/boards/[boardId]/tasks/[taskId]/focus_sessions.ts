import { withAuth } from "@lib/auth";
import { getNotionClientForUser } from '@lib/notion';

export const POST = withAuth(async (userId, context) => {
    const boardId = context.params.boardId!;
    const taskId = context.params.taskId!;
    const { duration, user } = await context.request.json();
    
    if (!duration || !user) {
        return new Response(JSON.stringify({ error: "Missing Data" }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try{
        const notion = await getNotionClientForUser(userId, context);
        const task = await notion.pages.retrieve({ page_id: taskId });

        const properties = task.properties;

        const focusLogProp = properties["Focus Log"];
        const focusSummaryProp = properties["Focus Summary"];

        let focusLog = [];
        let focusSummary = {};


        if (focusLogProp && focusLogProp.rich_text.length > 0) {
            try {
                focusLog = JSON.parse(focusLogProp.rich_text[0].plain_text);
            } catch (err) {
                console.error("Focus Log parse error:", err);
            }
        }

        if (focusSummaryProp && focusSummaryProp.rich_text.length > 0) {
            try {
                focusSummary = JSON.parse(focusSummaryProp.rich_text[0].plain_text);
            } catch (err) {
                console.error("Focus Summary parse error:", err);
            }
        }

        const newLog = {
            user,
            duration,
            fecha: new Date().toISOString(),
        };
        focusLog.push(newLog);

        focusSummary[user] = (focusSummary[user] || 0) + duration;

        await notion.pages.update({
            page_id: taskId,
            properties: {
                "Focus Log": {
                    rich_text: [
                        {
                            type: "text",
                            text: {
                                content: JSON.stringify(focusLog)
                            }
                        }
                    ]
                },
                "Focus Summary": {
                    rich_text: [
                        {
                            type: "text",
                            text: {
                                content: JSON.stringify(focusSummary)
                            }
                        }
                    ]
                }
            }
        });

        return new Response(
            JSON.stringify({
                mensaje: "Focus log added",
            }),{ 
                headers: { "Content-Type": "application/json" }
            }
        );
    } catch (error: any) {
        console.error(error.message)
        return new Response(JSON.stringify({
            error: "Unable to update task",
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        }
    );
    }
});
