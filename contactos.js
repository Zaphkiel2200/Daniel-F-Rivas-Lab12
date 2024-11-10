class ContactManager {
    constructor() {
        this.contacts = [];
        this.loadContacts();
        this.setupEventListeners();
    }

    loadContacts() {
        const savedContacts = localStorage.getItem('contacts');
        this.contacts = savedContacts ? JSON.parse(savedContacts) : [];
        this.renderContacts();
    }

    saveContacts() {
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }

    addContact(contact) {
        contact.id = Date.now().toString();
        this.contacts.push(contact);
        this.saveContacts();
        this.renderContacts();
    }

    updateContact(id, updatedContact) {
        const index = this.contacts.findIndex(contact => contact.id === id);
        if (index !== -1) {
            this.contacts[index] = { ...this.contacts[index], ...updatedContact };
            this.saveContacts();
            this.renderContacts();
        }
    }

    deleteContact(id) {
        this.contacts = this.contacts.filter(contact => contact.id !== id);
        this.saveContacts();
        this.renderContacts();
    }

    renderContacts() {
        const contactsList = document.getElementById('contactsList');
        contactsList.innerHTML = '';
        this.contacts.forEach(contact => {
            const contactCard = document.createElement('div');
            contactCard.className = 'contact-card';
            contactCard.innerHTML = `
                <h3>${contact.nombre}</h3>
                <p>Phone: ${contact.telefono}</p>
                <p>Email: ${contact.email}</p>
                <p>Address: ${contact.direccion}</p>
                <div class="contact-actions">
                    <button class="btn btn-primary" onclick="contactManager.editContact('${contact.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="contactManager.deleteContact('${contact.id}')">Delete</button>
                </div>
            `;
            contactsList.appendChild(contactCard);
        });
    }

    setupEventListeners() {
        const form = document.getElementById('contactForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                nombre: document.getElementById('nombre').value,
                telefono: document.getElementById('telefono').value,
                email: document.getElementById('email').value,
                direccion: document.getElementById('direccion').value
            };
            const contactId = document.getElementById('contactId').value;

            if (contactId) {
                this.updateContact(contactId, formData);
                document.getElementById('contactId').value = '';
            } else {
                this.addContact(formData);
            }
            form.reset();
        });
    }

    editContact(id) {
        const contact = this.contacts.find(contact => contact.id === id);
        if (contact) {
            document.getElementById('nombre').value = contact.nombre;
            document.getElementById('telefono').value = contact.telefono;
            document.getElementById('email').value = contact.email;
            document.getElementById('direccion').value = contact.direccion;
            document.getElementById('contactId').value = contact.id;
        }
    }
}

const contactManager = new ContactManager();
