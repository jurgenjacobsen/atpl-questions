import csv from 'csvtojson';
import fs from 'fs';

export const CONFIG = {
    CONVERT_CSV: false,
    INPUT_CSV_PATH: './input/1.csv',
    OUTPUT_JSON_PATH: './output/output1.json',
    
    CONVERT_JSON: true,
    INPUT_JSON_PATH: './output/output1.json',
    OUTPUT_TXT_PATH: './output/output1.txt',
}

if (CONFIG.CONVERT_CSV) {
    let outputRaw: {
        field1: string;
        ID: string;
        Author: string;
        Question: string;
        Answers: string;
        'Category / Topic': string;
    }[] = [];

    let outputProcessed: {
        id: number;
        question: string;
        answer: string;
        category: string;
    }[] = [];

    const csvFilePath = './input/1.csv';
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        outputRaw = jsonObj;    
        console.log('CSV file successfully processed.');
    })
    .then(() => {
        outputProcessed = outputRaw.map(item => {
            return {
                id: Number(item.ID),
                question: item.Question,
                answer: item.Answers,
                category: item['Category / Topic'],
            }
        }).sort((a, b) => a.category.localeCompare(b.category));

        console.log('CSV file successfully cleaned.');
    }).then(() => {
        fs.writeFile('./output/output1.json', JSON.stringify(outputProcessed, null, 2), (err) => {
            if (err) {
                console.error('Error writing raw output file:', err);
            } else {
                console.log('Cleaned output JSON file written successfully.');
            }
        });
    });
} else if (CONFIG.CONVERT_JSON) {
    // 1. Read the JSON file
    const rawData = fs.readFileSync(CONFIG.INPUT_JSON_PATH, 'utf-8');
    const data: { id: number; question: string; answer: string; category: string }[] = JSON.parse(rawData);

    // 2. Group data by category
    const groupedData = data.reduce((acc, item) => {
        const subject = item.category || 'Uncategorized';
        if (!acc[subject]) {
            acc[subject] = [];
        }
        acc[subject].push(item);
        return acc;
    }, {} as Record<string, typeof data>);

    // 3. Format the data into a string with titles
    let txtContent = '';
    for (const subject in groupedData) {
        txtContent += `${subject.toUpperCase()}\n`;

        groupedData[subject].forEach((q, index) => {
            txtContent += `${index + 1}. ${q.question}\n`;
            txtContent += `${q.answer}\n`;
            txtContent += `\n`;
        });
        txtContent += `\n`;
    }

    // 4. Write to the TXT file
    fs.writeFile(CONFIG.OUTPUT_TXT_PATH, txtContent, (err) => {
        if (err) {
            console.error('Error writing TXT file:', err);
        } else {
            console.log(`Successfully generated: ${CONFIG.OUTPUT_TXT_PATH}`);
        }
    });
}