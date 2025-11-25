function getFutureDate(daysAhead) {
  const base = new Date();
  base.setDate(base.getDate() + daysAhead);

  const day = String(base.getDate()).padStart(2, '0');
  const month = String(base.getMonth() + 1).padStart(2, '0');
  const year = base.getFullYear();

  return `${day}/${month}/${year}`;
}


module.exports = { getFutureDate};
