const express = require("express");
const {
  sequelize,
  User,
  Address,
  UserRole,
  Image,
  Video,
  Comment,
} = require("./models");

const app = express();
app.use(express.json());

//todo: create role
app.post("/roles", async (req, res) => {
  const { roleName } = req.body;
  try {
    await UserRole.create({ role: roleName });
    res.json({ msg: "Role created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(404).json({ msg: "Something went wrong!", error });
  }
});

//todo: get roles
app.get("/roles", async (req, res) => {
  try {
    const roles = await UserRole.findAll();
    res.json({ msg: "success", data: roles });
  } catch (error) {
    res.status(404).json({ msg: "Something went wrong!" });
  }
});

//todo: create user
app.post("/users", async (req, res) => {
  const { full_name, country_code, roleId } = req.body;
  try {
    let user = await User.create({ full_name, country_code });
    const role = await UserRole.findOne({ where: { id: roleId } });
    await role.addUser(user);
    user = await User.findOne({
      where: { id: user.id },
      include: [UserRole],
      attributes: ["role"],
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong!", error });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: UserRole,
          attributes: ["role"],
          through: {
            attributes: [],
          },
        },
      ],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong!", error });
  }
});

app.get("/users/:uuid", async (req, res) => {
  const { uuid } = req.params;
  try {
    const user = await User.findOne({
      where: { uuid },
      include: [UserRole],
    });
    res.json(user);
  } catch (err) {
    res.status(500).json("Something went wrong!" + err);
  }
});

app.put("/users/:uuid", async (req, res) => {
  const { uuid } = req.params;
  const { full_name, country_code } = req.body;
  try {
    const user = await User.update(
      { full_name, country_code },
      { where: { uuid } }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json("Something went wrong!");
  }
});

app.delete("/users/:uuid", async (req, res) => {
  const { uuid } = req.params;
  try {
    const user = await User.findOne({ where: { uuid } });
    await user.destroy();
    res.json({ msg: "User was deleted successfully." });
  } catch (err) {
    res.status(500).json("Something went wrong!");
  }
});

// app.post("/users/:uuid/aadhar", async (req, res) => {
//   const { uuid } = req.params;
//   const { aadharNumber, name } = req.body;
//   try {
//     const user = await User.findOne({ where: { uuid } });
//     const aadhar = await AadharCardDetail.create({
//       aadharNumber,
//       name,
//       userId: user.id,
//     });
//     res.json(aadhar);
//   } catch (err) {
//     res.status(500).json("Something went wrong!" + err);
//   }
// });

app.post("/users/:uuid/aadhar", async (req, res) => {
  const { uuid } = req.params;
  const { aadharNumber, name } = req.body;
  try {
    const user = await User.findOne({ where: { uuid } });
    const aadhar = await user.createAadharCardDetail({ name, aadharNumber });
    res.json(aadhar);
  } catch (err) {
    res.status(500).json("Something went wrong!" + err);
  }
});

// app.get("/users/:uuid/aadhar", async (req, res) => {
//   const { uuid } = req.params;
//   try {
//     const user = await User.findOne({ where: { uuid } });
//     const aadhar = await AadharCardDetail.findOne({
//       where: { userId: user.id },
//     });
//     res.json(aadhar);
//   } catch (err) {
//     res.status(500).json("Something went wrong!" + err);
//   }
// });

app.get("/users/:uuid/aadhar", async (req, res) => {
  const { uuid } = req.params;
  try {
    const user = await User.findOne({ where: { uuid } });
    const aadhar = await user.getAadharCardDetail();
    res.json(aadhar);
  } catch (err) {
    res.status(500).json("Something went wrong!" + err);
  }
});

// app.post("/users/:uuid/addresses", async (req, res) => {
//   const { uuid } = req.params;
//   const { name, street, city, country } = req.body;
//   try {
//     const user = await User.findOne({ where: { uuid } });
//     const address = await Address.create({
//       name,
//       city,
//       country,
//       street,
//       userId: user.id,
//     });
//     res.json(address);
//   } catch (err) {
//     res.status(500).json("Something went wrong!" + err);
//   }
// });

app.post("/users/:uuid/addresses", async (req, res) => {
  const { uuid } = req.params;
  const { name, street, city, country } = req.body;
  try {
    const user = await User.findOne({ where: { uuid } });
    const address = await user.createAddress({
      name,
      city,
      country,
      street,
    });
    res.json(address);
  } catch (err) {
    res.status(500).json("Something went wrong!" + err);
  }
});

// app.get("/users/:uuid/addresses", async (req, res) => {
//   const { uuid } = req.params;
//   try {
//     const user = await User.findOne({ where: { uuid } });
//     const addresses = await Address.findAll({
//       where: { userId: user.id },
//     });
//     res.json(addresses);
//   } catch (err) {
//     res.status(500).json("Something went wrong!" + err);
//   }
// });

app.get("/users/:uuid/addresses", async (req, res) => {
  const { uuid } = req.params;
  try {
    const user = await User.findOne({ where: { uuid } });
    const addresses = await user.getAddresses();
    res.json(addresses);
  } catch (err) {
    res.status(500).json("Something went wrong!" + err);
  }
});

// app.get("/users/:userUuid/addresses/:addressUuid", async (req, res) => {
//   const { userUuid, addressUuid } = req.params;
//   try {
//     const user = await User.findOne({ where: { uuid: userUuid } });
//     const address = await Address.findOne({
//       where: { userId: user.id, uuid: addressUuid },
//     });
//     res.json(address);
//   } catch (err) {
//     res.status(500).json("Something went wrong!" + err);
//   }
// });

app.get("/users/:userUuid/addresses/:addressUuid", async (req, res) => {
  const { userUuid, addressUuid } = req.params;
  try {
    const user = await User.findOne({ where: { uuid: userUuid } });
    const address = await user.getAddresses({ where: { uuid: addressUuid } });
    res.json(address);
  } catch (err) {
    res.status(500).json("Something went wrong!" + err);
  }
});

// app.put("/users/:userUuid/addresses/:addressUuid", async (req, res) => {
//   const { userUuid, addressUuid } = req.params;
//   const { name, street, city, country } = req.body;
//   try {
//     const user = await User.findOne({ where: { uuid: userUuid } });
//     const address = await Address.findOne({
//       where: { userId: user.id, uuid: addressUuid },
//     });
//     address.name = name || address.name;
//     address.street = street || address.street;
//     address.city = city || address.city;
//     address.country = country || address.country;
//     address.save();
//     res.json(address);
//   } catch (err) {
//     res.status(500).json("Something went wrong!" + err);
//   }
// });

app.put("/users/:userUuid/addresses/:addressUuid", async (req, res) => {
  const { userUuid, addressUuid } = req.params;
  const { name, street, city, country } = req.body;
  try {
    const user = await User.findOne({ where: { uuid: userUuid } });
    const address = await Address.update(
      { name, street, city, country },
      { where: { uuid: addressUuid, userId: user.id } }
    );
    res.json("Address updated successfully!");
  } catch (err) {
    res.status(500).json("Something went wrong!" + err);
  }
});

app.post("/images", async (req, res) => {
  const { url, width, height } = req.body;
  try {
    const image = await Image.create({ url, width, height });
    res.json({ msg: "Image created successfully!", data: image });
  } catch (error) {
    res.status(404).json({ msg: "Something went wrong!", error });
  }
});

app.post("/images/:id/comments", async (req, res) => {
  const { text } = req.body;
  const { id } = req.params;
  try {
    const image = await Image.findOne({ where: { id } });
    const comment = await image.createComment({ text });
    res.json({ msg: "Comment made successfully!", data: comment });
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "Something went wrong!", error });
  }
});

app.get("/images/:id/comments", async (req, res) => {
  const { id } = req.params;
  try {
    const image = await Image.findOne({ where: { id } });
    const comments = await image.getComments();
    res.json({ msg: "Success", data: comments });
  } catch (error) {
    res.status(404).json({ msg: "Something went wrong!", error });
  }
});

app.post("/videos", async (req, res) => {
  const { url, duration } = req.body;
  try {
    const video = await Video.create({ url, duration });
    res.json({ msg: "Video created successfully!", data: video });
  } catch (error) {
    res.status(404).json({ msg: "Something went wrong!", error });
  }
});

app.post("/videos/:id/comments", async (req, res) => {
  const { text } = req.body;
  const { id } = req.params;
  try {
    const video = await Video.findOne({ where: { id } });
    const comment = await video.createComment({ text });
    res.json({ msg: "Comment made successfully!", data: comment });
  } catch (error) {
    res.status(404).json({ msg: "Something went wrong!", error });
  }
});

app.get("/videos/:id/comments", async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findOne({ where: { id } });
    const comments = await video.getComments();
    res.json({ msg: "Success", data: comments });
  } catch (error) {
    res.status(404).json({ msg: "Something went wrong!", error });
  }
});

app.listen({ port: 7000 }, async () => {
  console.log("listening on port 7000");
  await sequelize.authenticate();
  console.log("database connected");
});
