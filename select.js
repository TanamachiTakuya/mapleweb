const indexScript = (() => {
    //宣言
    let csvArray = [[]];
    let select = document.getElementById("job");
    let skill = document.getElementById("skill");
    let jobname = document.getElementById("jobname");
    let addSelect = document.getElementById(`skillset`);
    const reset_Btn = document.getElementById('reset_btn');
    const skill_checked = document.getElementsByName('skill');
    let next_Btn = document.getElementById("next_btn");
    const backBtn = document.getElementById('second_back_btn');
    const secondNextBtn = document.getElementById("second_next_btn");
    const plusBtn = document.getElementById('plus_btn');
    let firstPageView = document.getElementById("first_page");
    let secondPageView = document.getElementById("second_page");
    let thirdPageView = document.getElementById("third_page");
    let preadd = `<div class="skillsetbox"><span>1</span>`;
    let skillsetboxIdCount = 0;
    let idNum = 1;
    let haveSkill = [];
    let wantSkill = [];
    let resultSkill = [];

    ////最初のページ
    ////csv
    function import_csv(csv_path) {
        fetch(csv_path)
            .then((res) => {
                if (!res.ok) {
                    console.log('正常にリクエストを処理できませんでした。');
                }
                return res.text();
            })
            .then((csv_data) => {
                csvArray = convert_array(csv_data);
                let jobArray = [];
                //jobの読込
                for (let i = 0; i < csvArray.length; i++) {
                    if (!jobArray.includes(csvArray[i][0])) {
                        jobArray.push(csvArray[i][0]);
                    }
                }
                for (let i = 0; i < jobArray.length - 1; i++) {
                    const option1 = document.createElement('option');
                    option1.value = `${jobArray[i]}`;
                    option1.textContent = `${jobArray[i]}`;
                    select.appendChild(option1);
                }
                //職業が変わった時の処理
                //スキルの設定
                select.onchange = event => {
                    if (select.value === "未選択") {
                        skill.style.display = "none";
                        removeFunc();
                    } else {
                        skill.style.display = "block";
                        skill.innerHTML = "";

                        for (let i = 0; i < csvArray.length; i++) {
                            if (select.value == csvArray[i][0]) {
                                let addSkill = `
                                <div class="skillbox">
                                <div>
                                  <input type="checkbox" name="skill" id="skill${i + 1}">
                                  <label for="skill${i + 1}" id="label${i + 1}">${csvArray[i][1]}</label>
                                </div>
                              </div>
                                `;
                                skill.innerHTML = skill.innerHTML + addSkill;
                            }
                        }
                    }
                }
            })
            .catch((error) => {
                console.log('エラーが発生しました。');
            })
    }
    // テキストデータを配列に変換
    function convert_array(csv_data) {
        let data_array = [];
        const data_string = csv_data.split('\n');
        for (let i = 0; i < data_string.length; i++) {
            data_array[i] = data_string[i].split(',');
        }
        return data_array;
    }
    //csvの出力
    let array = import_csv('./data.csv');
    //リセットボタンを押したときの処理
    reset_Btn.addEventListener('click', removeFunc, false);
    //進むボタンを押したときの処理
    next_Btn.addEventListener('click', firstNext, false);
    ////最初のページ関数
    function removeFunc() {
        for (let i = 0; i < skill_checked.length; i++) {
            skill_checked[i].checked = false;
        }
    }
    function firstNext() {
        let skill_true_count = 0;
        for (let i = 0; i < skill_checked.length; i++) {
            if (skill_checked[i].checked == true) {
                skill_true_count += 1;
            }
        }
        if (skill_true_count < 3) {
            alert("スキルを3個以上選択してください。");
        } else if (skill_true_count <= 9) {
            firstPageView.style.display = "none";
            secondPageView.style.display = "block";
            thirdPageView.style.display = "none";
            jobname.innerText = "職業名：" + select.value;
            loadSkill(0);
        } else {
            alert("スキルの選択は9個までにしてください。");
        }
    }
    function loadSkill(spanCount) {
        if (spanCount != 0) {
            preadd = `<div class="skillsetbox"><span>${spanCount + 1}</span>`;
            skillsetboxIdCount += 3;
            addSkills(skillsetboxIdCount);
        } else {
            preadd = `<div class="skillsetbox"><span>1</span>`;
            skillsetboxIdCount = 0;
            addSkills(0);
        }
        function addSkills(num) {
            for (let j = 0; j < 3; j++) {
                let midstart = `<select name="skillset${j + 1}" id="${j + 1 + num}"><option value="未選択" selected>(${j + 1})未選択</option>`;
                preadd += midstart;
                for (let i = 0; i < csvArray.length; i++) {
                    let skillboxID = document.getElementById(`skill${i + 1}`);
                    if (skillboxID != null) {
                        if (skillboxID.checked) {
                            let labelID = document.getElementById(`label${i + 1}`);
                            preadd += `<option value="${labelID.innerText}">${labelID.innerText}</option>`;
                        }
                    }
                }
                preadd = preadd + `</select>`;
            }
        }
        preadd += `</div>`;
        addSelect.insertAdjacentHTML("beforeend", preadd);
    }

    ////2ページ
    //戻るボタンを押したときの処理
    backBtn.addEventListener('click', secondBack, false);
    //Plusボタンを押したときの処理
    plusBtn.addEventListener('click', addColumn, false);
    //進むボタンを押したときの処理
    secondNextBtn.addEventListener('click', compareSelect, false);
    ////次のページ関数
    function secondBack() {
        addSelect.innerHTML = "";
        firstPageView.style.display = "block";
        secondPageView.style.display = "none";
        thirdPageView.style.display = "none";
    }
    function addColumn() {
        let classId = document.getElementsByClassName("skillsetbox");
        if (classId.length < 10) {
            loadSkill(classId.length);
        }
    }
    function compareSelect() {
        firstPageView.style.display = "none";
        secondPageView.style.display = "none";
        thirdPageView.style.display = "block";

        resultSkill = [];
        wantSkill = [];
        haveSkill = [];

        addChoiceSkill();
        wantSkill = createWantSkill();
        let testyo = combinationSkill();
        wantData = [testyo];
        console.log(testyo);
        let count = 0;
        console.log(wantSkill.length);
        if (wantSkill.length != 3) {
            while (true) {
                let testyo2 = combinationSkill();
                count = 0;
                for (let i = 0; i < testyo.length; i++) {
                    if (getIsDuplicate(testyo[i], testyo2[i])) {
                        count += 1;
                        if (count > (testyo.length - 1)) {
                            wantData.push(testyo2);
                        }
                    }
                }
                if (wantData.length > 2) {
                    break;
                }
            }
        }
        console.log(wantData);
        function getIsDuplicate(arr1, arr2) {
            return [...arr1, ...arr2].filter(item => arr1.includes(item) && arr2.includes(item)).length > 0
        }

        function combinationSkill() {
            let passCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            while (true) {
                passCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                let resultList = [];
                let test11 = randomCreate(0, wantSkill.length, 0);
                let test22 = randomCreate(0, wantSkill.length, 1);
                let test33 = randomCreate(0, wantSkill.length, 2);

                let test1 = [wantSkill[0], wantSkill[test11[1]], wantSkill[test11[2]]];
                let test2 = [wantSkill[1], wantSkill[test22[1]], wantSkill[test22[2]]];
                let test3 = [wantSkill[2], wantSkill[test33[1]], wantSkill[test33[2]]];
                let test4 = [];
                let test5 = [];
                let test6 = [];

                if (wantSkill.length == 3) {
                    passCounter.pop();
                    passCounter.pop();
                    passCounter.pop();
                    passCounter.pop();
                    passCounter.pop();
                    passCounter.pop();
                }
                if (wantSkill.length == 4) {
                    passCounter.pop();
                    passCounter.pop();
                    passCounter.pop();
                    passCounter.pop();
                    passCounter.pop();
                }
                if (wantSkill.length == 5) {
                    let test44 = randomCreate(Number(0), wantSkill.length, 3);
                    test4 = [wantSkill[3], wantSkill[test44[1]], wantSkill[test44[2]]];
                    passCounter.pop();
                    passCounter.pop();
                    passCounter.pop();
                    passCounter.pop();
                    pass(test4);
                }
                if (wantSkill.length == 6) {
                    let test44 = randomCreate(Number(0), wantSkill.length, 3);
                    test4 = [wantSkill[3], wantSkill[test44[1]], wantSkill[test44[2]]];
                    passCounter.pop();
                    passCounter.pop();
                    passCounter.pop();
                    pass(test4);
                }
                if (wantSkill.length == 7) {
                    let test44 = randomCreate(Number(0), wantSkill.length, 3);
                    test4 = [wantSkill[3], wantSkill[test44[1]], wantSkill[test44[2]]];
                    let test55 = randomCreate(0, wantSkill.length, 4);
                    test5 = [wantSkill[4], wantSkill[test55[1]], wantSkill[test55[2]]];
                    passCounter.pop();
                    passCounter.pop();
                    pass(test4);
                    pass(test5);
                }
                if (wantSkill.length == 8) {
                    let test44 = randomCreate(Number(0), wantSkill.length, 3);
                    test4 = [wantSkill[3], wantSkill[test44[1]], wantSkill[test44[2]]];
                    let test55 = randomCreate(0, wantSkill.length, 4);
                    test5 = [wantSkill[4], wantSkill[test55[1]], wantSkill[test55[2]]];
                    let test66 = randomCreate(0, wantSkill.length, 5);
                    test6 = [wantSkill[5], wantSkill[test66[1]], wantSkill[test66[2]]];
                    passCounter.pop();
                    pass(test4);
                    pass(test5);
                    pass(test6);
                }
                if (wantSkill.length == 9) {
                    let test44 = randomCreate(Number(0), wantSkill.length, 3);
                    test4 = [wantSkill[3], wantSkill[test44[1]], wantSkill[test44[2]]];
                    let test55 = randomCreate(0, wantSkill.length, 4);
                    test5 = [wantSkill[4], wantSkill[test55[1]], wantSkill[test55[2]]];
                    let test66 = randomCreate(0, wantSkill.length, 5);
                    test6 = [wantSkill[5], wantSkill[test66[1]], wantSkill[test66[2]]];
                    pass(test4);
                    pass(test5);
                    pass(test6);
                }
                pass(test1);
                pass(test2);
                pass(test3);

                if (passCounter.every(value => value >= 2)) {
                    resultList.push(test1, test2, test3);
                    if (wantSkill.length >= 5) {
                        resultList.push(test4);
                    }
                    if (wantSkill.length >= 7) {
                        resultList.push(test5);
                    }
                    if (wantSkill.length >= 8) {
                        resultList.push(test6);
                    }

                    return resultList;
                    break;
                }
                function pass(array) {
                    array.forEach(element => {
                        for (let j = 0; j < wantSkill.length; j++) {
                            if (element == wantSkill[j]) {
                                passCounter[j] += 1;
                            }
                        }
                    });
                };
            }
        }

        function randomCreate(min, max, removeNum) {
            /** 重複チェック用配列 */
            let randoms = [removeNum];
            /** 重複チェックしながら乱数作成 */
            for (i = 0; i < 2; i++) {
                while (true) {
                    let tmp = intRandom(min, max);
                    if ((!randoms.includes(tmp)) || (!randoms.includes(removeNum))) {
                        randoms.push(Number(tmp));
                        break;
                    }
                }
            }
            return randoms;
            /** min以上max以下の整数値の乱数を返す */
            function intRandom(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
        }
        /*         resultSkill = removeDuplicateList(wantSkill, haveSkill); */
        /*         let sortSkill = [];
                let sortJunretu1 = [];
                for (let i = 0; i < resultSkill.length; i++) {
                    for (let j = 0; j < resultSkill[i].length; j++) {
                        sortJunretu1.push(junretsu(resultSkill[i][j], 3));//第2引数はコア枠の数
                    }
                    sortSkill.push(sortJunretu1);
                }
        
                console.log(sortSkill);
            } */

        /*     function junretsu(balls, nukitorisu) {
                var arrs, i, j, zensu, results, parts;
                arrs = [];
                zensu = balls.length;
                if (zensu < nukitorisu) {
                    return;
                } else if (nukitorisu == 1) {
                    for (i = 0; i < zensu; i++) {
                        arrs[i] = [balls[i]];
                    }
                } else {
                    for (i = 0; i < zensu; i++) {
                        parts = balls.slice(0);
                        parts.splice(i, 1)[0];
                        results = junretsu(parts, nukitorisu - 1);
                        for (j = 0; j < results.length; j++) {
                            arrs.push([balls[i]].concat(results[j]));
                        }
                    }
                }
                return arrs;
            } */

        function createWantSkill() {
            let result1 = [];
            let result = [];
            for (let i = 0; i < csvArray.length; i++) {
                let skillboxID = document.getElementById(`skill${i + 1}`);
                if (skillboxID != null) {
                    if (skillboxID.checked) {
                        let labelID = document.getElementById(`label${i + 1}`);
                        result.push(labelID.innerText);
                    }
                }
            }
            for (let i = 0; i < result.length; i++) {
                let result2 = result[i].replace("\n", "");
                result1.push(result2);
            }
            return result1;
        }

        function addChoiceSkill() {
            idNum = 1;
            let loopnum = 1;
            let haveArray = [];
            while (true) {
                try {
                    let have = document.getElementById(`${idNum}`).value;
                    let haveIn = have.replace("\n", "");
                    haveArray.push(haveIn);
                    if ((loopnum % 3) == 0) {
                        haveSkill.push(haveArray);
                        haveArray = [];
                    }

                    idNum++;
                    loopnum++;
                } catch (e) {
                    break;
                }
            }
        }
        //第一引数[]、第二引数[[]]
        function removeDuplicateList(skillList, removeList) {
            let pattern = getPattern(skillList);
            let memorizeIndex = [];
            removePattern(removeList, pattern);
            for (let i = 0; i < memorizeIndex.length; i++) {
                pattern[memorizeIndex[i][0]].splice(memorizeIndex[i][1], 1);
            }
            return pattern
            //第一引数に選択されたスキルの配列を渡すと全通りのパターンを返す
            function getPattern(selectSkills) {
                let skillNum = 0;
                let coaFrame = 0;
                const combination = (nums, k) => {
                    let ans = [];
                    if (nums.length < k) {
                        return []
                    }
                    if (k === 1) {
                        for (let i = 0; i < nums.length; i++) {
                            ans[i] = [nums[i]];
                        }
                    } else {
                        for (let i = 0; i < nums.length - k + 1; i++) {
                            let row = combination(nums.slice(i + 1), k - 1);
                            for (let j = 0; j < row.length; j++) {
                                ans.push([nums[i]].concat(row[j]));
                            }
                        }
                    }
                    return ans;
                }

                skillNum = selectSkills.length;
                coaFrame = getFrame(skillNum);

                let headFixed = 0;
                let conbinationArray = [];
                //選択されたスキルの全ての組み合わせを抽出
                for (let i = 0; i < skillNum; i++) {
                    conbinationArray.push([[selectSkills[i]]]);
                    let compareList = [];

                    for (let j = 0; j < skillNum; j++) {
                        if (i !== j) {
                            compareList.push(selectSkills[j]);
                        }
                    }
                    let addCombination = combination(compareList, 2);
                    for (let k = 0; k < addCombination.length; k++) {
                        if (k === 0) {
                            conbinationArray[i][k].push(addCombination[k][0]);
                            conbinationArray[i][k].push(addCombination[k][1]);
                        } else {
                            let list = [selectSkills[i]];
                            list.push(addCombination[k][0]);
                            list.push(addCombination[k][1]);
                            conbinationArray[i].push(list);
                        }
                    }
                }

                return conbinationArray;
            }
            //第一引数に持っているコアの配列を渡す、第二引数にスキルの全通りのパターンを渡すと持っているコアのパターンを除いた配列が返ってくる
            function removePattern(removeSkills, skillPattern) {
                for (let i = 0; i < skillPattern.length; i++) {//0-4
                    for (let j = 0; j < skillPattern[i].length; j++) {//0-4
                        for (let l = 0; l < removeSkills.length; l++) {
                            if (removeSkills[l][0] === skillPattern[i][j][0]) {
                                if ((skillPattern[i][j].includes(removeSkills[l][0])) && (skillPattern[i][j].includes(removeSkills[l][1])) && (skillPattern[i][j].includes(removeSkills[l][2]))) {
                                    memorizeIndex.push([i, j, l]);
                                }
                            }
                        }
                    }
                }

            }
        }
    }
    function getFrame(skillsuu) {
        if (skillsuu >= 12) {
            return 8
        } else if (skillsuu >= 10) {
            return 7
        } else if (skillsuu >= 8) {
            return 6
        } else if (skillsuu >= 7) {
            return 5
        } else if (skillsuu >= 5) {
            return 4
        } else {
            return 3
        }
    }
    ////3ページ

})();