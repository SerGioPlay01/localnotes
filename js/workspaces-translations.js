/**
 * Workspaces Translations - Переводы для рабочих пространств
 * Добавляет переводы в существующий объект translations
 */

(function() {
    'use strict';

    // Ждём загрузки основного объекта переводов
    function waitForTranslations() {
        return new Promise((resolve) => {
            const check = () => {
                if (typeof translations !== 'undefined') {
                    resolve();
                } else {
                    setTimeout(check, 50);
                }
            };
            check();
        });
    }

    async function addWorkspaceTranslations() {
        await waitForTranslations();

        const workspaceTranslations = {
            en: {
                // Workspaces
                addWorkspace: "Add workspace",
                createWorkspace: "Create Workspace",
                enterWorkspaceName: "Enter workspace name:",
                newWorkspace: "New Workspace",
                renameWorkspace: "Rename Workspace",
                enterNewName: "Enter new name:",
                deleteWorkspace: "Delete Workspace",
                deleteWorkspaceConfirm: "Are you sure you want to delete workspace \"{name}\"? All notes in this workspace will be deleted.",
                cannotDeleteDefaultWorkspace: "Cannot delete default workspace. Set another workspace as default first.",
                setAsDefault: "Set as default",
                selectWorkspace: "Select Workspace",
                selectWorkspaceHint: "Choose a workspace to save this note:",
                createNewWorkspace: "Create New",
                rename: "Rename",
                changeColor: "Change color",
            },
            ru: {
                // Рабочие пространства
                addWorkspace: "Добавить пространство",
                createWorkspace: "Создать пространство",
                enterWorkspaceName: "Введите название пространства:",
                newWorkspace: "Новое пространство",
                renameWorkspace: "Переименовать пространство",
                enterNewName: "Введите новое название:",
                deleteWorkspace: "Удалить пространство",
                deleteWorkspaceConfirm: "Вы уверены, что хотите удалить пространство \"{name}\"? Все заметки в этом пространстве будут удалены.",
                cannotDeleteDefaultWorkspace: "Невозможно удалить пространство по умолчанию. Сначала установите другое пространство как основное.",
                setAsDefault: "Сделать основным",
                selectWorkspace: "Выберите пространство",
                selectWorkspaceHint: "Выберите пространство для сохранения заметки:",
                createNewWorkspace: "Создать новое",
                rename: "Переименовать",
                changeColor: "Изменить цвет",
            },
            ua: {
                // Робочі простори
                addWorkspace: "Додати простір",
                createWorkspace: "Створити простір",
                enterWorkspaceName: "Введіть назву простору:",
                newWorkspace: "Новий простір",
                renameWorkspace: "Перейменувати простір",
                enterNewName: "Введіть нову назву:",
                deleteWorkspace: "Видалити простір",
                deleteWorkspaceConfirm: "Ви впевнені, що хочете видалити простір \"{name}\"? Усі нотатки в цьому просторі будуть видалені.",
                cannotDeleteDefaultWorkspace: "Неможливо видалити простір за замовчуванням. Спочатку встановіть інший простір як основний.",
                setAsDefault: "Зробити основним",
                selectWorkspace: "Виберіть простір",
                selectWorkspaceHint: "Виберіть простір для збереження нотатки:",
                createNewWorkspace: "Створити новий",
                rename: "Перейменувати",
                changeColor: "Змінити колір",
            },
            pl: {
                // Przestrzenie robocze
                addWorkspace: "Dodaj przestrzeń",
                createWorkspace: "Utwórz przestrzeń",
                enterWorkspaceName: "Wprowadź nazwę przestrzeni:",
                newWorkspace: "Nowa przestrzeń",
                renameWorkspace: "Zmień nazwę przestrzeni",
                enterNewName: "Wprowadź nową nazwę:",
                deleteWorkspace: "Usuń przestrzeń",
                deleteWorkspaceConfirm: "Czy na pewno chcesz usunąć przestrzeń \"{name}\"? Wszystkie notatki w tej przestrzeni zostaną usunięte.",
                cannotDeleteDefaultWorkspace: "Nie można usunąć domyślnej przestrzeni. Najpierw ustaw inną przestrzeń jako domyślną.",
                setAsDefault: "Ustaw jako domyślną",
                selectWorkspace: "Wybierz przestrzeń",
                selectWorkspaceHint: "Wybierz przestrzeń do zapisania notatki:",
                createNewWorkspace: "Utwórz nową",
                rename: "Zmień nazwę",
                changeColor: "Zmień kolor",
            },
            cs: {
                // Pracovní prostory
                addWorkspace: "Přidat prostor",
                createWorkspace: "Vytvořit prostor",
                enterWorkspaceName: "Zadejte název prostoru:",
                newWorkspace: "Nový prostor",
                renameWorkspace: "Přejmenovat prostor",
                enterNewName: "Zadejte nový název:",
                deleteWorkspace: "Smazat prostor",
                deleteWorkspaceConfirm: "Opravdu chcete smazat prostor \"{name}\"? Všechny poznámky v tomto prostoru budou smazány.",
                cannotDeleteDefaultWorkspace: "Nelze smazat výchozí prostor. Nejprve nastavte jiný prostor jako výchozí.",
                setAsDefault: "Nastavit jako výchozí",
                selectWorkspace: "Vyberte prostor",
                selectWorkspaceHint: "Vyberte prostor pro uložení poznámky:",
                createNewWorkspace: "Vytvořit nový",
                rename: "Přejmenovat",
                changeColor: "Změnit barvu",
            },
            sk: {
                // Pracovné priestory
                addWorkspace: "Pridať priestor",
                createWorkspace: "Vytvoriť priestor",
                enterWorkspaceName: "Zadajte názov priestoru:",
                newWorkspace: "Nový priestor",
                renameWorkspace: "Premenovať priestor",
                enterNewName: "Zadajte nový názov:",
                deleteWorkspace: "Zmazať priestor",
                deleteWorkspaceConfirm: "Naozaj chcete zmazať priestor \"{name}\"? Všetky poznámky v tomto priestore budú zmazané.",
                cannotDeleteDefaultWorkspace: "Nie je možné zmazať predvolený priestor. Najprv nastavte iný priestor ako predvolený.",
                setAsDefault: "Nastaviť ako predvolený",
                selectWorkspace: "Vyberte priestor",
                selectWorkspaceHint: "Vyberte priestor na uloženie poznámky:",
                createNewWorkspace: "Vytvoriť nový",
                rename: "Premenovať",
                changeColor: "Zmeniť farbu",
            },
            bg: {
                // Работни пространства
                addWorkspace: "Добави пространство",
                createWorkspace: "Създай пространство",
                enterWorkspaceName: "Въведете име на пространството:",
                newWorkspace: "Ново пространство",
                renameWorkspace: "Преименувай пространство",
                enterNewName: "Въведете ново име:",
                deleteWorkspace: "Изтрий пространство",
                deleteWorkspaceConfirm: "Сигурни ли сте, че искате да изтриете пространство \"{name}\"? Всички бележки в това пространство ще бъдат изтрити.",
                cannotDeleteDefaultWorkspace: "Не може да се изтрие пространството по подразбиране. Първо задайте друго пространство като основно.",
                setAsDefault: "Задай като основно",
                selectWorkspace: "Изберете пространство",
                selectWorkspaceHint: "Изберете пространство за запазване на бележката:",
                createNewWorkspace: "Създай ново",
                rename: "Преименувай",
                changeColor: "Промени цвят",
            },
            hr: {
                // Radni prostori
                addWorkspace: "Dodaj prostor",
                createWorkspace: "Stvori prostor",
                enterWorkspaceName: "Unesite naziv prostora:",
                newWorkspace: "Novi prostor",
                renameWorkspace: "Preimenuj prostor",
                enterNewName: "Unesite novi naziv:",
                deleteWorkspace: "Izbriši prostor",
                deleteWorkspaceConfirm: "Jeste li sigurni da želite izbrisati prostor \"{name}\"? Sve bilješke u ovom prostoru bit će izbrisane.",
                cannotDeleteDefaultWorkspace: "Nije moguće izbrisati zadani prostor. Prvo postavite drugi prostor kao zadani.",
                setAsDefault: "Postavi kao zadani",
                selectWorkspace: "Odaberite prostor",
                selectWorkspaceHint: "Odaberite prostor za spremanje bilješke:",
                createNewWorkspace: "Stvori novi",
                rename: "Preimenuj",
                changeColor: "Promijeni boju",
            },
            sr: {
                // Радни простори
                addWorkspace: "Додај простор",
                createWorkspace: "Направи простор",
                enterWorkspaceName: "Унесите назив простора:",
                newWorkspace: "Нови простор",
                renameWorkspace: "Преименуј простор",
                enterNewName: "Унесите нови назив:",
                deleteWorkspace: "Обриши простор",
                deleteWorkspaceConfirm: "Да ли сте сигурни да желите да обришете простор \"{name}\"? Све белешке у овом простору ће бити обрисане.",
                cannotDeleteDefaultWorkspace: "Није могуће обрисати подразумевани простор. Прво поставите други простор као подразумевани.",
                setAsDefault: "Постави као подразумевани",
                selectWorkspace: "Изаберите простор",
                selectWorkspaceHint: "Изаберите простор за чување белешке:",
                createNewWorkspace: "Направи нови",
                rename: "Преименуј",
                changeColor: "Промени боју",
            },
            bs: {
                // Radni prostori
                addWorkspace: "Dodaj prostor",
                createWorkspace: "Napravi prostor",
                enterWorkspaceName: "Unesite naziv prostora:",
                newWorkspace: "Novi prostor",
                renameWorkspace: "Preimenuj prostor",
                enterNewName: "Unesite novi naziv:",
                deleteWorkspace: "Obriši prostor",
                deleteWorkspaceConfirm: "Da li ste sigurni da želite obrisati prostor \"{name}\"? Sve bilješke u ovom prostoru će biti obrisane.",
                cannotDeleteDefaultWorkspace: "Nije moguće obrisati podrazumijevani prostor. Prvo postavite drugi prostor kao podrazumijevani.",
                setAsDefault: "Postavi kao podrazumijevani",
                selectWorkspace: "Izaberite prostor",
                selectWorkspaceHint: "Izaberite prostor za spremanje bilješke:",
                createNewWorkspace: "Napravi novi",
                rename: "Preimenuj",
                changeColor: "Promijeni boju",
            },
            mk: {
                // Работни простори
                addWorkspace: "Додај простор",
                createWorkspace: "Создај простор",
                enterWorkspaceName: "Внесете име на просторот:",
                newWorkspace: "Нов простор",
                renameWorkspace: "Преименувај простор",
                enterNewName: "Внесете ново име:",
                deleteWorkspace: "Избриши простор",
                deleteWorkspaceConfirm: "Дали сте сигурни дека сакате да го избришете просторот \"{name}\"? Сите белешки во овој простор ќе бидат избришани.",
                cannotDeleteDefaultWorkspace: "Не може да се избрише стандардниот простор. Прво поставете друг простор како стандарден.",
                setAsDefault: "Постави како стандарден",
                selectWorkspace: "Изберете простор",
                selectWorkspaceHint: "Изберете простор за зачувување на белешката:",
                createNewWorkspace: "Создај нов",
                rename: "Преименувај",
                changeColor: "Промени боја",
            },
            sl: {
                // Delovni prostori
                addWorkspace: "Dodaj prostor",
                createWorkspace: "Ustvari prostor",
                enterWorkspaceName: "Vnesite ime prostora:",
                newWorkspace: "Nov prostor",
                renameWorkspace: "Preimenuj prostor",
                enterNewName: "Vnesite novo ime:",
                deleteWorkspace: "Izbriši prostor",
                deleteWorkspaceConfirm: "Ali ste prepričani, da želite izbrisati prostor \"{name}\"? Vsi zapiski v tem prostoru bodo izbrisani.",
                cannotDeleteDefaultWorkspace: "Privzetega prostora ni mogoče izbrisati. Najprej nastavite drug prostor kot privzet.",
                setAsDefault: "Nastavi kot privzet",
                selectWorkspace: "Izberite prostor",
                selectWorkspaceHint: "Izberite prostor za shranjevanje zapiska:",
                createNewWorkspace: "Ustvari nov",
                rename: "Preimenuj",
                changeColor: "Spremeni barvo",
            }
        };

        // Добавляем переводы в существующий объект
        Object.keys(workspaceTranslations).forEach(lang => {
            if (translations[lang]) {
                Object.assign(translations[lang], workspaceTranslations[lang]);
            } else {
                translations[lang] = workspaceTranslations[lang];
            }
        });

        console.log('Workspace translations added');
    }

    // Инициализация
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addWorkspaceTranslations);
    } else {
        addWorkspaceTranslations();
    }

})();
