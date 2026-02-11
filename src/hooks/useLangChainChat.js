import { useState, useCallback } from 'react';

/**
 * Custom hook for integrating LangChain LLM chat functionality
 * Handles communication with the backend /api/chat endpoint
 * 
 * Returns:
 * - processQuery: Function to send user queries to the LLM service
 * - isLoading: Boolean indicating if request is in progress
 * - error: String error message if request failed
 */
export const useLangChainChat = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Process a user query through the LangChain LLM service
     * 
     * @param {string} userMessage - The user's query/message
     * @returns {Promise<Object>} - The parsed response with query_type and action
     */
    const processQuery = useCallback(async (userMessage) => {
        setIsLoading(true);
        setError(null);

        try {
            // Make API request to backend chat endpoint
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (err) {
            const errorMessage = err.message || 'Failed to process query';
            setError(errorMessage);
            console.error('Error processing query:', errorMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        processQuery,
        isLoading,
        error
    };
};
