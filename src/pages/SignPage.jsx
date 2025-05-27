import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export function SignPage() {
    const startingValues = { username: "", slogan: "", date: "", maxStartup: "" };
    const [formValues, setFormValues] = useState(startingValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [startupList, setStartupList] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [tournamentStarted, setTournamentStarted] = useState(false);

    useEffect(() => {
        const saved_startups = localStorage.getItem('StartupList');
        const saved_pairs = localStorage.getItem('StartupPairs');
        
        if (saved_startups) 
        {
            setStartupList(JSON.parse(saved_startups));
        }

        if (saved_pairs) 
        {
            setTournamentStarted(JSON.parse(saved_pairs).length > 0);
        }}, []);

    const handleChange = (e) => {
        const {name, value}=e.target;
        setFormValues({...formValues, [name]: value });
        };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate(formValues);
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            const newStartup = {
                nameList: formValues.username,
                sloganList: formValues.slogan,
                dateList: formValues.date,
                points: 70
            };
            
            const updatedList = [...startupList, newStartup];
            setStartupList(updatedList);
            localStorage.setItem('StartupList', JSON.stringify(updatedList));
            
            setIsSubmit(true);
            setFormValues(startingValues);
            setShowSuccess(true);
            
            setTimeout(() => {
                setShowSuccess(false);
                setIsSubmit(false);
            }, 2000);
        }
    };

    const validate = (values) => {
        const errors = {};
        const validation = /^[A-Za-z\s]+$/;
    
        if (tournamentStarted) {
            errors.tournament = "Cannot add startups after tournament has started";
            return errors;
        }
    
        if (!values.username) {
            errors.username = "Startup name is required";
        }
        else if (!validation.test(values.username)) {
            errors.username = "Startup name must contain only letter";
        }
    
        if (!values.slogan) {
            errors.slogan = "Startup slogan is required";
        }
        else if (!validation.test(values.slogan)) {
            errors.slogan = "Slogan must contain only letters and spaces";
        }
    
        if (!values.date) {
            errors.date = "Foundation Date is required";
        }
        else {
            const input_date = new Date(values.date);
            const now = new Date();
            if (isNaN(input_date.getTime())) {
                errors.date = "Invalid date format";
            }
            else if (input_date > now) {
                errors.date = "Foundation date cannot be in the future";
            }
            else if(input_date.getFullYear() < 2000){
                errors.date = "Foundation date must be older";
            }
        }
    
        if (startupList.length >= 8) {
            errors.maxStartup = "You already have 8 startups";
        }
        return errors;
    };


    
    return (
        <>
            <Link to="/"><button id="back_button" className="option_block"> Home</button></Link>

            <div className="home_wrapper">
            <header className="top_header">
            <h1>Startup Rush</h1>
                <a href="https://www.linkedin.com/in/matheus-salgado02"  className="contact_link">Contact</a>
            </header>
                
                <div className="main_layout">
                <div className="light_section">
                <div className="main_content"> {showSuccess && (<div className="success_message">Startup registered successfully</div>)}
                    {tournamentStarted ?(
                        <div className="tournament_started_message">
                            <h2>Tournament has already started</h2>
                            <p>You cannot add new startups once the tournament has begun</p>
                        </div>): 
                            (
                            <form onSubmit={handleSubmit}>
                                <h2>Add a new startup to the bracket</h2>
                                <div>
                                    <h3>Name of the startup</h3>
                                    <input type="text" name="username" value={formValues.username} onChange={handleChange} disabled={tournamentStarted}/>
                                    <p className="error_message">{formErrors.username}</p>

                                    <h3>Slogan</h3>
                                    <input name="slogan" value={formValues.slogan} onChange={handleChange} disabled={tournamentStarted}/>
                                    <p className="error_message">{formErrors.slogan}</p>

                                    <h3>Year of foundation</h3>
                                    <input type="date" name="date" value={formValues.date} onChange={handleChange} disabled={tournamentStarted}/>
                                     <p className="error_message">{formErrors.date}</p>
                                    <div className="option_block">
                                    <button type="submit" disabled={tournamentStarted}>Submit</button>
                                    </div>
                                     <p className="error_message">{formErrors.maxStartup || formErrors.tournament}</p>
                                    </div>
                            </form>
                            )
                            }
                        </div>
                    </div>
                    <div className="dark_section"></div>
                </div>
            </div>
        </>
    );
}