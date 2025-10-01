import { ApiType } from './types';

// Field specification for each integration platform.
// These are intentionally generic so the AI prompt can embed them directly.
export interface IntegrationFieldSpec {
  id: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'password';
  required?: boolean;
}

export const PLATFORM_FIELD_SETS: Record<ApiType, IntegrationFieldSpec[]> = {
  [ApiType.SHOPIFY]: [
    { id: 'storeDomain', label: 'Store Domain', placeholder: 'your-store.myshopify.com', required: true },
    { id: 'accessToken', label: 'Access Token', placeholder: 'shpat_***', type: 'password', required: true },
    { id: 'apiVersion', label: 'API Version', placeholder: '2024-07', required: false },
  ],
  [ApiType.GENERIC_WMS]: [
    { id: 'baseUrl', label: 'Base URL', placeholder: 'https://wms.example.com/api', required: true },
    { id: 'apiKey', label: 'API Key', placeholder: 'wms_xxx', type: 'password', required: true },
  ],
  [ApiType.MAGENTO]: [
    { id: 'baseUrl', label: 'Base URL', placeholder: 'https://magento.example.com', required: true },
    { id: 'accessToken', label: 'Access Token', placeholder: 'magento_token', type: 'password', required: true },
  ],
  [ApiType.BIGCOMMERCE]: [
    { id: 'storeHash', label: 'Store Hash', placeholder: 'abc123', required: true },
    { id: 'clientId', label: 'Client ID', placeholder: 'bc client id', required: true },
    { id: 'accessToken', label: 'Access Token', placeholder: 'bc access token', type: 'password', required: true },
    { id: 'apiVersion', label: 'API Version', placeholder: 'v3', required: false },
  ],
  [ApiType.AMAZON_SELLER_CENTRAL]: [
    { id: 'lwaClientId', label: 'LWA Client ID', placeholder: 'amzn1.application-oa2-client...', required: true },
    { id: 'lwaClientSecret', label: 'LWA Client Secret', type: 'password', required: true },
    { id: 'refreshToken', label: 'Refresh Token', type: 'password', required: true },
    { id: 'region', label: 'Region', placeholder: 'NA/EU/FE', required: false },
  ],
  [ApiType.ETSY_API]: [
    { id: 'apiKey', label: 'API Key', placeholder: 'etsy_key', required: true },
    { id: 'sharedSecret', label: 'Shared Secret', type: 'password', required: true },
  ],
  [ApiType.SQUARE_API]: [
    { id: 'accessToken', label: 'Access Token', type: 'password', placeholder: 'sq0atp-***', required: true },
    { id: 'environment', label: 'Environment', placeholder: 'sandbox | production', required: false },
  ],
  [ApiType.WOOCOMMERCE]: [
    { id: 'storeUrl', label: 'Store URL', placeholder: 'https://store.example.com', required: true },
    { id: 'consumerKey', label: 'Consumer Key', required: true },
    { id: 'consumerSecret', label: 'Consumer Secret', type: 'password', required: true },
  ],
  [ApiType.SHIPSTATION]: [
    { id: 'apiKey', label: 'API Key', required: true },
    { id: 'apiSecret', label: 'API Secret', type: 'password', required: true },
  ],
  [ApiType.STRIPE]: [
    { id: 'secretKey', label: 'Secret Key', type: 'password', placeholder: 'sk_live_***', required: true },
    { id: 'apiVersion', label: 'API Version', placeholder: '2024-06-20', required: false },
  ],
};

export const INTEGRATION_STORAGE_KEY = 'integration_config_v1';