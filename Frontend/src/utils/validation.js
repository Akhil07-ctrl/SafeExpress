// Basic form validation rules
const validateRequired = (value) => {
  return value !== undefined && value !== null && value !== '';
};

const validateVehicleNumber = (value) => {
  const pattern = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
  return pattern.test(value);
};

const validateMobileNumber = (value) => {
  const pattern = /^[6-9]\d{9}$/;
  return pattern.test(value);
};

const validateCapacity = (value) => {
  return !isNaN(value) && parseInt(value) > 0;
};

const validateCoordinates = (lat, lng) => {
  return !isNaN(lat) && !isNaN(lng) &&
    parseFloat(lat) >= -90 && parseFloat(lat) <= 90 &&
    parseFloat(lng) >= -180 && parseFloat(lng) <= 180;
};

export const validateVehicleForm = (values) => {
  const errors = {};

  if (!validateRequired(values.vehicleNumber)) {
    errors.vehicleNumber = 'Vehicle number is required';
  } else if (!validateVehicleNumber(values.vehicleNumber)) {
    errors.vehicleNumber = 'Invalid vehicle number format (e.g., MH01AB1234)';
  }

  if (!validateRequired(values.vehicleType)) {
    errors.vehicleType = 'Vehicle type is required';
  }

  if (!validateRequired(values.capacity)) {
    errors.capacity = 'Capacity is required';
  } else if (!validateCapacity(values.capacity)) {
    errors.capacity = 'Capacity must be a positive number';
  }

  return errors;
};

export const validateDeliveryForm = (values) => {
  const errors = {};

  if (!validateRequired(values.pickupLocation)) {
    errors.pickupLocation = 'Pickup location is required';
  }

  if (!validateRequired(values.dropLocation)) {
    errors.dropLocation = 'Drop location is required';
  }

  if (!validateRequired(values.customerName)) {
    errors.customerName = 'Customer name is required';
  }

  if (!validateRequired(values.customerMobile)) {
    errors.customerMobile = 'Customer mobile is required';
  } else if (!validateMobileNumber(values.customerMobile)) {
    errors.customerMobile = 'Invalid mobile number';
  }

  if (!validateRequired(values.assignedDriver)) {
    errors.assignedDriver = 'Driver assignment is required';
  }

  if (!validateRequired(values.assignedVehicle)) {
    errors.assignedVehicle = 'Vehicle assignment is required';
  }

  if (!validateRequired(values.pickupTime)) {
    errors.pickupTime = 'Pickup time is required';
  }

  if (!validateRequired(values.dropTime)) {
    errors.dropTime = 'Drop time is required';
  } else if (new Date(values.dropTime) <= new Date(values.pickupTime)) {
    errors.dropTime = 'Drop time must be after pickup time';
  }

  if (!validateCoordinates(values.pickupLat, values.pickupLng)) {
    errors.pickupCoords = 'Invalid pickup coordinates';
  }

  if (!validateCoordinates(values.dropLat, values.dropLng)) {
    errors.dropCoords = 'Invalid drop coordinates';
  }

  if (!validateRequired(values.baseFare)) {
    errors.baseFare = 'Base fare is required';
  } else if (isNaN(values.baseFare) || parseFloat(values.baseFare) < 0) {
    errors.baseFare = 'Base fare must be a positive number';
  }

  return errors;
};
