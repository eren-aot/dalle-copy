"use client"
import React, { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import axios from "axios";

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import { Card } from '@/components/ui/card';

const formSchema = z.object({
    prompt: z.string().min(5, {
        message: "Prompt must be at least 5 characters"
    })
})

const DashboardPage = () => {

    const router = useRouter();

    const [photos, setPhotos] = useState<string[]>([])
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    })

    const isLoading = form.formState.isSubmitting;

    console.log(form.watch("prompt"));

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        // console.log(data)

        try {
            console.log("Hii there")

            setPhotos([]);
            const response = await axios.post("/api/generate-images", data);

            const urls = response.data.map((image: { url: string }) => image.url);
            // console.log(response.data.imageUrl)

            setPhotos(urls);


        } catch (error) {

            console.log(error)
        } finally {

            router.refresh();
        }
    }


    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start with a detailed description</FormLabel>
                                <FormControl>
                                    <Input placeholder="picture you want to generate" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isLoading}>Submit</Button>
                </form>
            </Form>

            <div className='space-y-4 mt-4'>
                {isLoading && (
                    <div className='p-8 rounded-lg w-full flex items-center justify-center bg-muted '>
                        <Loader />
                    </div>
                )}

                {photos.length === 0 && !isLoading && (
                    <p>No images Started</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                    {photos.map((photo) => (
                        <Card key={photo} className="rounded-lg overflow-hidden">
                            <div className="relative aspect-square">
                                <Image
                                    fill
                                    alt="Generated"
                                    src={photo}
                                />
                            </div>
                            {/* <CardFooter className="p-2">
                                <Button onClick={() => window.open(photo)} variant="secondary" className="w-full">
                                    <Download className="h-4 w-4 mr-2" />
                                </Button>
                            </CardFooter> */}
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DashboardPage