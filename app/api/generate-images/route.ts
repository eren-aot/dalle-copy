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
        console.log(image)
        return NextResponse.json(image.data);

        
    } catch (error) {
        
        console.log("ERROR IN GENERATING IMAGES ROUTE", error);

        return new NextResponse("Error in generating images",{status : 500});
    }
}

export async function GET() {

    return NextResponse.json({message : "Generate Images"},{status : 200});
}