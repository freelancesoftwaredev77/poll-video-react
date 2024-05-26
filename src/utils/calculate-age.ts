const calculateAge = (dateString: string) => {
  const today = new Date();
  const [day, month, year] = dateString.split('-').map(Number);
  const birthDate = new Date(year, month - 1, day);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
};

export default calculateAge;
