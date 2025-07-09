export interface InvoiceItem {
  id: string
  description: string
  hsnSac: string
  gstRate: number
  quantity: number
  rate: number
  taxAmount: number
  amount: number
}

export interface InvoiceData {
  // Header
  title: string
  copyType: string

  // Basic Info
  invoiceTo: string
  billingAddress?: string
  invoiceNo: string
  dated: string
  deliveryChallenDate: string
  modeOfPayments: string
  referenceNo: string
  refDate: string

  // GSTIN/UIN
  supplierGstin: string
  // supplierPan: string
  supplierState: string
  supplierCode: string

  buyerGstin: string
  // buyerPan: string
  buyerOrderNo: string
  buyerOrderDate: string

  // Dispatch Details
  shippingAddress?: string
  dispatchDocNo: string
  dispatchedThrough: string
  destination: string
  termsOfDelivery: string

  // Items
  items: InvoiceItem[]

  // Tax Details
  cgstRate: number
  sgstRate: number

  // Declaration
  declaration: string
  authorizedSignatory: string

  // Bank Settings
  bankName: string
  accountName: string
  accountNumber: string
  branchName: string
  ifscCode: string
}

export interface InvoiceSettings {
  // Header Settings
  title: string
  copyType: string
  companyLogo?: string
  signature?: string 

  // Supplier Settings
  supplierName: string
  supplierAddress: string
  supplierGstin: string
  supplierState: string
  supplierCode: string
  supplierContact?: string

  // Bank Settings
  bankName: string
  accountName: string
  accountNumber: string
  branchName: string
  ifscCode: string
}

const today = new Date().toISOString().slice(0, 10) // "YYYY-MM-DD" format

export const defaultInvoiceSettings: InvoiceSettings = {
  title: "TAX INVOICE",
  copyType: "(Original Copy)",
  companyLogo: "/Logo.png",
  supplierName: "Mauli Enterprises",
  supplierAddress: "Flat no 10, Skyline Elite, plot 86, Behind RT road Purnanagar, Chinchwad, Pune -411019",
  supplierGstin: "27AVQPB1797E1ZD",
  supplierState: "Maharashtra",
  supplierCode: "27",
  bankName: "Axis Bank Ltd.",
  accountName: "Mauli Enterprises.",
  accountNumber: "923020015730842",
  branchName: "Chikhali Road, P Pune, Pune 411019",
  ifscCode: "UTIB0002654",
  supplierContact: "9922958544",
  signature: "/signAndStamp.jpg", 
}

export const defaultInvoiceData: InvoiceData = {
  title: "TAX INVOICE",
  copyType: "(Original Copy)",
  invoiceTo: "Data Not Provided",
  billingAddress: "Data Not Provided",
  shippingAddress: "Data Not Provided",
  referenceNo: "NA",
  refDate: "NA",
  invoiceNo: "00000",
  dated: today,
  deliveryChallenDate: "NA",
  modeOfPayments: "NA",
  supplierGstin: "",
  supplierState: "Maharashtra",
  supplierCode: "27",
  buyerGstin: "NA",
  buyerOrderNo: "0000",
  buyerOrderDate: today,
  dispatchDocNo: "NA",
  dispatchedThrough: "NA",
  destination: "NA",
  termsOfDelivery: "NA",
  items: [
    {
      id: "1",
      description: "NA",
      hsnSac: "--",
      gstRate: 18,
      quantity: 0,
      rate: 0,
      taxAmount: 0,
      amount: 0,
    },
  ],
  cgstRate: 9,
  sgstRate: 9,
  declaration:
    "Interest @24% will be charged on the bill if not paid on the due date.\nGoods are sent at owner's risk and our responsibility ceases on the goods leaving our premises For ID \nGoods once sold will not be taken back \nCertify that the particulars given above are true and correct Subject to PUNE Jurisdiction, E. & Ο.Ε. \n⁠Kindly check your GST Number and inform us in case of wrong GST number or No GST Number, We Shall not be liable for disallowance of your input tax credit in future for wrong GST Number or No GST Number",
  authorizedSignatory: "",
  bankName: "Axis Bank Ltd.",
  accountName: "Mauli Enterprises.",
  accountNumber: "923020015730842",
  branchName: "Chikhali Road, P Pune, Pune 411019",
  ifscCode: "UTIB0002654",
}
