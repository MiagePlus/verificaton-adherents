const csv = require('csv-parser');
const fileStream = require('fs');
const adherents = [];
const inscrits = [];

function parseAdherent(adherentFile, helloAssoFile) {
    fileStream.createReadStream(adherentFile)
    .pipe(csv({ separator: ',' }))
    .on('data', (data) => {
        // Crée un objet contenant le nom et le prénom (en minuscule, sans espace et sans accent) d'un adhérent
        var adherent = {
            Prénom : data.Prénom.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
            Nom : data.Nom.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        }
        adherents.push(adherent);
    }).on('end', () => {
        console.log(adherents);
        parseHelloAsso(helloAssoFile);
    });
}

function parseHelloAsso(helloAssoFile) {
    fileStream.createReadStream(helloAssoFile)
    .pipe(csv({ separator: ';' }))
    .on('data', (data) => {
        if (data.Formule.startsWith('Tarif')) {
            // Crée un objet contenant le nom et le prénom (en minuscule, sans espace et sans accent) d'un inscrit
            const inscrit = {
                Prénom : data.Prénom.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
                Nom : data.Nom.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
            }
            inscrits.push(inscrit);
        }
    })
    .on('end', () => {
        //console.log(inscrits);
        rapprochementDesParticipants()
    });
}

/**
 * Fais le rapprochement entre la liste des adhérents et les inscrits
 */
function rapprochementDesParticipants() {
    const erreur = [];
    const bon = [];
    inscrits.forEach(inscrit => {
        var present = false;
        adherents.forEach(adherent => {
            if (adherent.Nom == inscrit.Nom 
                && adherent.Prénom == inscrit.Prénom) {
                    present = true;
                }
        });
        if (present) {
            bon.push(inscrit);
        } else {
            erreur.push(inscrit);
        }
    });
    console.log('BON')
    console.log(bon);
    console.log('ERREUR')
    console.log(erreur);
}

parseAdherent('Adhésion 2018-2019 - Adhésion 2018-2019.csv', 
              'export-passation-de-miage-01_02_2019-06_04_2019.csv');

    


