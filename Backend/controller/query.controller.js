import Query from "../models/query.js"
import { getLocationData } from "../utils/getLocation.js";

//returns all the queries present in db
export const allQueries = async (req, res) => {
    try {
        let allQueries = await Query.find();
        return res.status(201).json(allQueries);
    } catch (error) {
        console.log("error in addQuery controller");
        return res.state(500).json({ error: "Internal Server Error" });
    }
}

//adds new query in db
export const addQuery = async (req, res) => {
    try {
        let { id } = req.params;

        let { location, description, img, category, urgency, status, estimatedImpact, targetPopulation } = req.body;
        let address = await getLocationData(location[0], location[1]);

        const newQuery = new Query({
            raisedBy: id,
            location: {
                village: address.village,
                county: address.county,
                district: address.district,
                state: address.state,
                country: address.country
            },
            latitude: location[0],
            longitude: location[1],
            description: description,
            img: img,
            category: category,
            urgency: urgency,
            status, status,
            estimatedImpact: estimatedImpact,
            targetPopulation: targetPopulation,
        });

        let savedQuery = await newQuery.save();

        res.send(savedQuery);
    } catch (error) {
        console.log("error in addQuery controller" + error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

//get information of the perticular query which user want  to edit
export const getEditQueryInfo = async (req, res) => {
    try {
        let { id } = req.params;

        let foundQuery = await Query.findById(id);
        return res.status(200).json(foundQuery);
    } catch (error) {
        console.log("error in getEditQueryInfo controller");
        return res.state(500).json({ error: "Internal Server Error" });
    }
}

// edit existing query
export const editQuery = async (req, res) => {
    try {

        let { id } = req.params;
        let { raisedBy, queryId } = req.body;
        console.log("this is owner : " + id);
        console.log("this is query : " + raisedBy);
        if (id !== raisedBy) {
            return res.status(402).json({ error: "you are not the author of this query" });
        }


        const { location, description, img, category, urgency, status, targetPopulation } = req.body;
        const address = await getLocationData(location[0], location[1]);
        const updatedQuery = await Query.findOneAndUpdate(
            { _id: queryId }, // Match the document by its _id
            {
                location: {
                    village: address.village,
                    county: address.county,
                    district: address.district,
                    state: address.state,
                    country: address.country
                },
                latitude: location[0],
                longitude: location[1],
                description: description,
                img: img,
                category: category,
                urgency: urgency,
                status: status,
                targetPopulation: targetPopulation,
            },
            { new: true } // Set to true if you want to return the updated document

        );
        res.status(200).json(updatedQuery);
    } catch (error) {
        console.log("error in editQuery controller");
        return res.state(500).json({ error: "Internal Server Error" });
    }
}
