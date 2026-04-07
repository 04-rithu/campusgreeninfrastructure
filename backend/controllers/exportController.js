const Zone = require("../models/Zone");
const Watering = require("../models/Watering");
const Pesticide = require("../models/Pesticide");
const Trimming = require("../models/Trimming");
const Waste = require("../models/Waste");
const Suggestion = require("../models/Suggestion");

const convertToCSV = (objArray, fields) => {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = fields.join(',') + '\r\n';

    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (let index in fields) {
            if (line !== '') line += ',';
            
            const field = fields[index];
            let val = array[i][field];
            
            // Handle dates
            if (val instanceof Date) {
                val = val.toLocaleDateString();
            } else if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
                val = `"${val.replace(/"/g, '""')}"`;
            } else if (val === null || val === undefined) {
                val = '';
            }
            
            line += val;
        }
        str += line + '\r\n';
    }
    return str;
};

exports.exportData = async (req, res) => {
    try {
        const { module: moduleName } = req.params;
        let data = [];
        let fields = [];
        let fileName = `export_${moduleName}_${new Date().toISOString().split('T')[0]}.csv`;

        switch (moduleName) {
            case 'zones':
                data = await Zone.find();
                fields = ['zoneName', 'requiredGreenCover', 'currentGreenCover'];
                break;
            case 'watering':
                data = await Watering.find();
                fields = ['zone', 'task_description', 'schedule_date', 'duration_minutes'];
                break;
            case 'pesticide':
                data = await Pesticide.find();
                fields = ['zone', 'pesticide_type', 'quantity', 'schedule_date'];
                break;
            case 'trimming':
                data = await Trimming.find();
                fields = ['zone', 'trimming_type', 'schedule_date', 'staff_assigned'];
                break;
            case 'waste':
                data = await Waste.find();
                fields = ['zone', 'waste_amount', 'collection_date'];
                break;
            case 'suggestions':
                data = await Suggestion.find();
                fields = ['user_name', 'zone', 'suggestion_type', 'description', 'status', 'date_submitted'];
                break;
            default:
                return res.status(400).json({ message: "Invalid module name" });
        }

        const csv = convertToCSV(data, fields);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.status(200).send(csv);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
