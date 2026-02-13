import { useState, useEffect } from 'react';
import api from '../api/axios';

const useZones = () => {
    const [zones, setZones] = useState([]);
    const [loadingZones, setLoadingZones] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchZones = async () => {
            try {
                // Determine the correct endpoint based on backend routes
                // Trying /zones first, if it fails due to 404, it might be under /api/zones or /api/planner/zones
                // Based on server.js: app.use("/api", plannerRoutes); and plannerRoutes has router.get("/zones", ...)
                // So full path is /api/zones
                const response = await api.get('/zones');
                setZones(response.data);
                console.log('Zones fetched:', response.data);
            } catch (err) {
                console.error('Error fetching zones:', err);
                setError(err);
                // toast.error('Failed to load zones'); // Optional: prevent toast spam
            } finally {
                setLoadingZones(false);
            }
        };

        fetchZones();
    }, []);

    return { zones, loadingZones, error };
};

export default useZones;
