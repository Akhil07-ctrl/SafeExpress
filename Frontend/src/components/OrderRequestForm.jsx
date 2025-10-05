import { useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";

const OrderRequestForm = ({ user, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: user?.name || "",
    customerMobile: "",
    pickupLocation: "",
    dropLocation: "",
    vehicleType: "truck",
    pickupTime: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestData = {
        customerName: formData.customerName,
        customerMobile: formData.customerMobile,
        pickupLocation: formData.pickupLocation,
        dropLocation: formData.dropLocation,
        vehicleType: formData.vehicleType,
        pickupTime: formData.pickupTime,
      };

      await api.post("/order-requests", requestData);
      toast.success("Order request submitted successfully!");
      setIsOpen(false);
      setFormData({
        customerName: user?.name || "",
        customerMobile: "",
        pickupLocation: "",
        dropLocation: "",
        vehicleType: "truck",
        pickupTime: "",
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit order request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-brand hover:bg-brand-dark text-white rounded-lg px-6 py-3 font-medium shadow-md transition-all"
      >
        + Request New Order
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative" style={{ zIndex: 10000 }}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Request New Order</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="customerMobile"
                    value={formData.customerMobile}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    placeholder="10-digit number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Location *
                </label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 123 Main St, City"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Drop Location *
                </label>
                <input
                  type="text"
                  name="dropLocation"
                  value={formData.dropLocation}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 456 Oak Ave, City"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type *
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="car">Car</option>
                  <option value="truck">Truck</option>             
                  <option value="bike">Bike</option>
                  <option value="van">Van</option>   
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Time *
                </label>
                <input
                  type="datetime-local"
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-brand hover:bg-brand-dark text-white rounded-lg px-4 py-2.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg px-4 py-2.5 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderRequestForm;
