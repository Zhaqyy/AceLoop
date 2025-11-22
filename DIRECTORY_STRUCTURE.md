# Recommended Directory Structure for Furniture Product Configurator

```
src/
├── components/
│   ├── ProductConfigurator/          # Main configurator container
│   │   ├── ProductConfigurator.jsx
│   │   └── ProductConfigurator.module.scss
│   │
│   ├── ProductGallery/                # Image gallery section
│   │   ├── ProductGallery.jsx
│   │   ├── ProductGallery.module.scss
│   │   ├── ImageThumbnail.jsx
│   │   └── ImageViewer.jsx
│   │
│   ├── ProductDetails/                # Product info section
│   │   ├── ProductDetails.jsx
│   │   ├── ProductDetails.module.scss
│   │   ├── ProductHeader.jsx          # Title, collection, rating
│   │   └── ProductPrice.jsx
│   │
│   ├── CustomizationOptions/          # All customization selectors
│   │   ├── CustomizationOptions.jsx
│   │   ├── CustomizationOptions.module.scss
│   │   ├── OptionSelector.jsx         # Reusable selector component
│   │   ├── SizeSelector.jsx
│   │   ├── UpholsterySelector.jsx
│   │   ├── LegStyleSelector.jsx
│   │   ├── LegFinishSelector.jsx
│   │   └── ColorSwatch.jsx            # Reusable color swatch
│   │
│   ├── ProductActions/                # Purchase-related components
│   │   ├── ProductActions.jsx
│   │   ├── ProductActions.module.scss
│   │   ├── QuantitySelector.jsx
│   │   ├── AddToCartButton.jsx
│   │   └── FinancingInfo.jsx
│   │
│   ├── ProductInfo/                   # Additional info sections
│   │   ├── ProductInfo.jsx
│   │   ├── ProductInfo.module.scss
│   │   ├── Dimensions.jsx
│   │   ├── ShippingInfo.jsx
│   │   └── WarrantyInfo.jsx
│   │
│   └── ui/                            # Shared UI components
│       ├── Button/
│       │   └── Button.jsx
│       ├── Dropdown/
│       │   └── Dropdown.jsx
│       ├── Accordion/
│       │   └── Accordion.jsx
│       ├── Tabs/
│       │   └── Tabs.jsx
│       └── Rating/
│           └── Rating.jsx
│   │
│   └── components.scss                # Shared component styles
│
├── hooks/
│   ├── useProductConfigurator.js      # Main configurator state logic
│   ├── useProductImages.js            # Image gallery logic
│   ├── usePriceCalculation.js         # Dynamic price calculation
│   └── useCart.js                     # Cart management
│
├── data/
│   ├── products/                      # Product data/configs
│   │   └── reese-sofa.js
│   ├── options/                       # Available options configs
│   │   ├── sizes.js
│   │   ├── upholstery.js
│   │   ├── legStyles.js
│   │   └── legFinishes.js
│   └── constants.js                   # App-wide constants
│
├── utils/
│   ├── price.js                       # Price formatting utilities
│   ├── validation.js                  # Form/option validation
│   └── imageHelpers.js                # Image handling utilities
│
├── context/
│   ├── ProductContext.jsx             # Product state context
│   └── CartContext.jsx                # Cart state context
│
├── styles/
│   ├── _variables.scss                # SCSS variables (colors, spacing)
│   ├── _mixins.scss                   # Reusable SCSS mixins
│   ├── _global.scss                   # Global styles
│   └── main.scss                      # Main stylesheet (imports all)
│
├── App.jsx
├── App.scss
├── main.jsx
└── index.scss
```

## Key Principles:

1. **Component-Based**: Each major section is its own component
2. **Reusability**: Shared components (OptionSelector, ColorSwatch) can be reused
3. **Separation of Concerns**: Logic in hooks, data in data/, UI in components/
4. **Scalability**: Easy to add new products or customization options
5. **Maintainability**: Clear organization makes it easy to find and modify code

## Styling Approach:

- **SCSS Modules**: Each component folder uses `ComponentName.module.scss` for scoped styles
- **Shared Styles**: `components/components.scss` for shared component styles
- **Global Styles**: `styles/` folder with variables, mixins, and global styles
- **SCSS Variables & Mixins**: Centralized in `styles/_variables.scss` and `styles/_mixins.scss`

