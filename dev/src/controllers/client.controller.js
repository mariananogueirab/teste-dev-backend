const { createClient } = require('../services/client.service');
const { created } = require('../utils/dictionary/statusCode');
const currentDate = require('../utils/functions/currentDate');

const userCreate = async (req, res) => {
  const { name, gender, health_problems, birth_date } = req.body;
  
  try {
    const creation_date = currentDate();
    const id = await createClient(name, gender, health_problems, birth_date, creation_date);

    const newCustomer = {
      _id: id,
      name,
      birth_date,
      gender,
      health_problems,
      creation_date,
    }

    return res.status(created).json({ 'registered customer': newCustomer });
  } catch (error) {
    return res.status(error.status).json({ message: error.message });
  }
};

module.exports = {
  userCreate,
};
