export enum ApiType {
    SHOPIFY = 'Shopify',
    GENERIC_WMS = 'Generic WMS',
    MAGENTO = 'Magento',
    BIGCOMMERCE = 'BigCommerce',
    AMAZON_SELLER_CENTRAL = 'Amazon Seller Central',
    ETSY_API = 'Etsy API',
    SQUARE_API = 'Square API',
    WOOCOMMERCE = 'WooCommerce',
    SHIPSTATION = 'ShipStation',
    STRIPE = 'Stripe',
}

export enum ResourceType {
    ORDERS = 'Orders',
    PRODUCTS = 'Products',
    CUSTOMERS = 'Customers',
}

export interface IntegrationResult {
    pythonCode: string;
    nodeCode: string;
    sampleData: Record<string, any>;
    nextSteps: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    content: string | IntegrationResult;
    error?: boolean;
}

// Shape used to store arbitrary integration credential pairs keyed by `${ApiType}:${fieldId}`
export type IntegrationConfigMap = Record<string, string>;