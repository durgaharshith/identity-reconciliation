const sql = require('../config/db'); 

exports.identifyContact = async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: 'At least one of email or phone number is required' });
  }

  try {
    const matchedContacts = await sql`
        SELECT * FROM Contact
        WHERE (email = ${email} OR phoneNumber = ${phoneNumber})
        AND deletedAt IS NULL
        ORDER BY createdAt ASC
    `;

    let primaryContact;

    if (matchedContacts.length === 0) {
      const inserted = await sql`
        INSERT INTO Contact (email, phoneNumber, linkprecedence)
        VALUES (${email || null}, ${phoneNumber || null}, 'primary')
        RETURNING *`;

      const newContact = inserted[0];

      return res.json({
        contact: {
          primaryContactId: newContact.id,
          emails: [newContact.email],
          phoneNumbers: [newContact.phoneNumber],
          secondaryContactIds: []
        }
      });
    }

    primaryContact = matchedContacts.find(c => c.linkprecedence === 'primary') || matchedContacts[0];

    for (const contact of matchedContacts) {
      if (contact.id !== primaryContact.id && contact.linkprecedence === 'primary') {
        await sql`
          UPDATE Contact
          SET linkprecedence = 'secondary', linkedId = ${primaryContact.id}
          WHERE id = ${contact.id}
        `;
      }
    }

    const alreadyExists = matchedContacts.some(
      c => c.email === email && c.phoneNumber === phoneNumber
    );

    if (!alreadyExists) {
      await sql`
        INSERT INTO Contact (email, phoneNumber, linkprecedence, linkedId)
        VALUES (${email}, ${phoneNumber}, 'secondary', ${primaryContact.id})
      `;
    }

    const allLinked = await sql`
        SELECT * FROM Contact
        WHERE (id = ${primaryContact.id} OR linkedId = ${primaryContact.id})
        AND deletedAt IS NULL
    `;
    console.log('All linked contacts:', allLinked);

    const emails = [...new Set(allLinked.map(c => c.email).filter(Boolean))];
    const phoneNumbers = [...new Set(allLinked.map(c => c.phonenumber).filter(Boolean))];
    const secondaryContactIds = allLinked
      .filter(c => c.linkprecedence === 'secondary')
      .map(c => c.id);

    return res.json({
      contact: {
        primaryContactId: primaryContact.id,
        emails,
        phoneNumbers,
        secondaryContactIds
      }
    });
  } catch (err) {
    console.error('Error in identifyContact:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


exports.deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql`
      UPDATE Contact
      SET deletedAt = NOW()
      WHERE id = ${id} AND deletedAt IS NULL
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: 'Contact not found or already deleted' });
    }

    res.json({ message: 'Contact deleted successfully', contact: result[0] });
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
