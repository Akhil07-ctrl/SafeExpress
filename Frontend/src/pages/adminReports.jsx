import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";

import api from "../utils/api";

const AdminReports = () => {
  const navigate = useNavigate();
  const [driverData, setDriverData] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const driversRes = await api.get("/deliveries/reports/driver-time");
        const vehiclesRes = await api.get("/deliveries/reports/vehicle-utilization");

        // Convert avgDeliveryTime from ms to hours for readability
        const drivers = driversRes.data.map(d => ({
          name: d._id.name,
          avgHours: (d.avgDeliveryTime / 1000 / 60 / 60).toFixed(2),
          totalDeliveries: d.totalDeliveries
        }));

        const vehicles = vehiclesRes.data.map(v => ({
          name: v._id.numberPlate,
          deliveries: v.deliveriesCount
        }));

        setDriverData(drivers);
        setVehicleData(vehicles);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <section className="bg-white rounded-xl shadow p-5">
        <h3 className="text-lg font-medium mb-4">Average Delivery Time per Driver (Hours)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={driverData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avgHours" fill="#3B82F6" name="Avg Hours" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="bg-white rounded-xl shadow p-5">
        <h3 className="text-lg font-medium mb-4">Vehicle Utilization (Deliveries Count)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={vehicleData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="deliveries" fill="#10B981" name="Deliveries" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default AdminReports;
