import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: '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', // Replace with your OpenAI API key
});

export async function POST(request : Request) {

    try {

        const body = await request.json();
        const {prompt} = body;

        if (!prompt) {
            // return res.status(400).json({ error: 'Prompt is required.' });

            return new NextResponse("Prompt is required",{status : 400});
          }
      
          const image = await openai.images.generate({
            model: 'dall-e-2', // Update with the latest model name if needed
            prompt,
          });
      
        //   res.json({ data: image.data });
        return NextResponse.json({image : image.data});

        
    } catch (error) {
        
        console.log("ERROR IN GENERATING IMAGES ROUTE", error);

        return new NextResponse("Error in generating images",{status : 500});
    }
}

export async function GET() {

    return NextResponse.json({message : "Generate Images"},{status : 200});
}