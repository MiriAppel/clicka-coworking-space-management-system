import { Button } from '../../../Common/Components/BaseComponents/Button';
import { Form } from '../../../Common/Components/BaseComponents/Form';

export const AddContract = () => {
    return (
        <div>
            <h1>add Contract</h1>

            {/* זה טופס לדוג' צריך להכניס את הפרטים של החוזה */}
           <Form dir="rtl" onSubmit={(e) => { e.preventDefault(); alert("SEND!"); }}>
                <label htmlFor="name">שם</label>
                <input
                    id="name"
                    name="name"
                    className="border px-3 py-2 rounded w-full"
                    placeholder="הכנס את שמך"
                />
                <Button type="submit" variant="primary" size="md">שלח</Button>
            </Form>
        </div>
    );
}