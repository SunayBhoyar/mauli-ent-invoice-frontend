"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FileText, Edit3, Search } from "lucide-react"
import InvoiceGenerator from "../pages/invoice-generator"
import FindInvoices from "../pages/invoice-finder"
import HomeScreen from "../pages/home-dashboard"

export default function Dashboard() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FileText className="h-8 w-8 text-blue-600" />
        Dashboard
      </h1>
      <Tabs defaultValue="home" className="w-full">
        <TabsList className="flex w-full bg-gray-100 rounded-lg shadow mb-6 overflow-hidden">
          <TabsTrigger
            value="home"
            className="flex-1 py-3 px-4 flex items-center gap-2 justify-center font-semibold text-gray-700 transition-colors hover:bg-blue-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Home
          </TabsTrigger>
          <TabsTrigger
            value="create"
            className="flex-1 py-3 px-4 flex items-center gap-2 justify-center font-semibold text-gray-700 transition-colors hover:bg-blue-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Edit3 className="h-4 w-4" />
            Create Invoice
          </TabsTrigger>
          <TabsTrigger
            value="find"
            className="flex-1 py-3 px-4 flex items-center gap-2 justify-center font-semibold text-gray-700 transition-colors hover:bg-blue-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Search className="h-4 w-4" />
            Find Invoice
          </TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="bg-white rounded-lg shadow p-6">
          <HomeScreen />
        </TabsContent>
        <TabsContent value="create" className="bg-white rounded-lg shadow p-6">
          <InvoiceGenerator />
        </TabsContent>
        <TabsContent value="find" className="bg-white rounded-lg shadow p-6">
          <FindInvoices />
        </TabsContent>
      </Tabs>
    </div>
  )
}
