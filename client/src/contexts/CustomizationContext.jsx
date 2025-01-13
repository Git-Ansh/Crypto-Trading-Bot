// src/contexts/CustomizationContext.jsx
import React, { createContext, useState, useMemo } from 'react';

// Create the CustomizationContext
export const CustomizationContext = createContext();

// CustomizationProvider Component
export const CustomizationProvider = ({ children }) => {
    // Define the customization state with default values
    const [customization, setCustomization] = useState({
        mode: 'light', // 'light' or 'dark'
        palette: {
            primary: '#1976d2', // Default primary color (Material-UI blue)
            secondary: '#dc004e', // Default secondary color (Material-UI pink)
            background: {
                default: '#f5f5f5', // Default background color
                paper: '#000000', // Default paper/background card color
            },
            text: {
                primary: '#000000', // Default primary text color
                secondary: '#ffffff', // Default secondary text color (for dark mode)
            },
        },
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Default font family
            fontSize: 14, // Base font size
            h1: { fontSize: '2.125rem' },
            h2: { fontSize: '1.75rem' },
            h3: { fontSize: '1.5rem' },
            h4: { fontSize: '1.25rem' },
            h5: { fontSize: '1rem' },
            h6: { fontSize: '0.875rem' },
        },
        spacing: 8, // Base spacing unit (used for margins, paddings, etc.)
        borderRadius: 90, // Border radius for components
        shadows: {
            // Define custom shadows or use Material-UI's default shadows
            1: '0px 1px 3px rgba(0,0,0,0.2)',
            2: '0px 1px 5px rgba(0, 0, 0, 0.2)',
            // Add more shadows as needed
        },
    });

    // Function to update customization settings
    const updateCustomization = (newCustomization) => {
        setCustomization((prev) => ({
            ...prev,
            ...newCustomization,
            palette: {
                ...prev.palette,
                ...(newCustomization.palette || {}),
            },
            typography: {
                ...prev.typography,
                ...(newCustomization.typography || {}),
            },
            shadows: {
                ...prev.shadows,
                ...(newCustomization.shadows || {}),
            },
        }));
    };

    // Memoize the context value to optimize performance
    const contextValue = useMemo(() => ({
        customization,
        updateCustomization,
    }), [customization]);

    return (
        <CustomizationContext.Provider value={contextValue}>
            {children}
        </CustomizationContext.Provider>
    );
};
