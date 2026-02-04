import {useState} from 'react'
import {pushToDataLayer} from '../utils/gtm'

function FormTracker() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Відстеження змін у формі
        pushToDataLayer({
            event: 'form_interaction',
            form_id: 'contact_form',
            form_name: 'Контактна форма',
            field_name: name,
            field_value: value.substring(0, 50) // Обмежуємо довжину для приватності
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        pushToDataLayer({
            event: 'form_submit',
            form_id: 'contact_form',
            form_name: 'Контактна форма',
            form_destination: '/api/contact'
        })

        // Якщо api url є у змінній середовища, надсилаємо форму на ендпоїнт
        const apiUrl = import.meta.env.VITE_API_URL;
        if (apiUrl) {
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
                .then(() => {
                    // успішне відправлення (не використовується результат)
                })
                .catch(() => {
                    // обробка помилки відправлення (не використовується помилка)
                })
        }

        setFormData({name: '', email: '', message: ''})
    }

    const setDefaultDataToForm = () => {
        setFormData({name: 'Іван Іванов', email: 'ivan@mail.com', message: 'Привіт! Це тестове повідомлення.'})
    }

    return (
        <div className="form-tracker">
            <h3>Відстеження форми</h3>
            <form onSubmit={handleSubmit} id="contact_form" data-analytics-id="contact_form">
                <div className="form-group">
                    <label>
                        Ім'я:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            id="name-input"
                            data-analytics-id="name-input"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            id="email-input"
                            data-analytics-id="email-input"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Повідомлення:
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows="4"
                            required
                            id="message-input"
                            data-analytics-id="message-input"
                        />
                    </label>
                </div>
                <button type="button" onClick={setDefaultDataToForm} id="set-form-values-button"
                        data-analytics-id="set-form-values-button">Заповнити форму
                </button>
                <button type="submit" id="submit-form-button" data-analytics-id="submit-form-button">Відправити</button>
            </form>
        </div>
    )
}

export default FormTracker
