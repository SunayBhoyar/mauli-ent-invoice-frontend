import { useState, useEffect } from "react"
import { FileText } from "lucide-react"
import { InvoicePreview } from "@/components/invoice-preview"
import { defaultInvoiceSettings } from "@/types/invoice"

export default function HomeScreen() {
    const [recentInvoices, setRecentInvoices] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

    const handleView = (inv: any) => {
        setSelectedInvoice(inv)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedInvoice(null)
    }
    
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/invoices/recent`)
            .then(res => res.json())
            .then(data => setRecentInvoices(data))
    }, [])

    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Recent Invoices</h2>
            <ul className="space-y-4">
                {recentInvoices.length === 0 && (
                    <li className="text-gray-500 text-center py-8 bg-white rounded shadow border">
                        No invoices found.
                    </li>
                )}
                {recentInvoices.map((inv: any) => (
                    <li key={inv.invoiceNo} className="flex items-center justify-between bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 text-blue-600 rounded-full p-2">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                                    Invoice No:
                                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-sm">
                                        {inv.invoiceNo}
                                    </span>
                                </div>
                                <div className="text-gray-600 text-sm mt-1">
                                    <span className="font-medium">To:</span> {inv.invoiceTo}
                                </div>
                                <div className="text-gray-400 text-xs mt-1">Date: {inv.dated}</div>
                            </div>
                        </div>
                        <button
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            onClick={() => handleView(inv)}
                        >
                            View
                        </button>
                    </li>
                ))}
            </ul>
             {/* Modal for Invoice Preview */}
            {showModal && selectedInvoice && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                            onClick={closeModal}
                        >
                            &times;
                        </button>
                        <InvoicePreview invoiceData={selectedInvoice} settings={defaultInvoiceSettings} />
                    </div>
                </div>
            )}
        </div>
    )
}