"use client"

import { useState, useEffect, useRef } from "react"
import { InvoiceEditor } from "@/components/invoice-editor"
import { InvoicePreview } from "@/components/invoice-preview"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Edit3, Download, Printer, Settings } from "lucide-react"
import { type InvoiceData, type InvoiceSettings, defaultInvoiceData, defaultInvoiceSettings } from "@/types/invoice"
import { InvoiceSettings as InvoiceSettingsComponent } from "@/components/invoice-settings"
import { } from "react"

export default function InvoiceGenerator() {
    const [invoiceData, setInvoiceData] = useState<InvoiceData>(defaultInvoiceData)
    const [settings, setSettings] = useState<InvoiceSettings>(defaultInvoiceSettings)

    useEffect(() => {
        async function fetchNextInvoiceNo() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/invoices/next-invoice-no`)
                const data = await res.json()
                if (data?.nextInvoiceNo) {
                    setInvoiceData(prev => ({
                        ...prev,
                        invoiceNo: data.nextInvoiceNo,
                    }))
                }
            } catch (err) {
                // Optionally handle error
                console.error("Failed to fetch next invoice number", err)
            }
        }
        fetchNextInvoiceNo()
    }, [])


    return (
        <div className="min-h-screen">
            <div className="container mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold mb-2">Invoice Generators</h2>
                    </div>
                </div>

                <Tabs defaultValue="edit" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="settings" className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Settings
                        </TabsTrigger>
                        <TabsTrigger value="edit" className="flex items-center gap-2">
                            <Edit3 className="h-4 w-4" />
                            Edit Invoice
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Preview
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="settings" className="mt-6">
                        <InvoiceSettingsComponent settings={settings} onUpdate={setSettings} />
                    </TabsContent>

                    <TabsContent value="edit" className="mt-6">
                        <InvoiceEditor invoiceData={invoiceData} onUpdate={setInvoiceData} settings={settings} />
                    </TabsContent>

                    <TabsContent value="preview" className="mt-6">
                        <InvoicePreview
                            invoiceData={invoiceData}
                            settings={settings}
                            onReset={() => setInvoiceData(defaultInvoiceData)}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
