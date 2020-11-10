var SampleJSONData1

fetch('http://localhost:5000/todos')
    .then(response => response.json())
    .then(data => {
        SampleJSONData1 = data;
        func();
    });


function func() {
    jQuery(document).ready(function ($) {
        var comboTree1, comboTree2;
        comboTree1 = $('#justAnInputBox').comboTree({
            source: SampleJSONData1,
            isMultiple: true,
            cascadeSelect: false,
            collapse: true,
            selectableLastNode: true
        });

        comboTree3 = $('#justAnInputBox1').comboTree({
            source: SampleJSONData1,
            isMultiple: true,
            cascadeSelect: true,
            collapse: false
        });

        comboTree2 = $('#justAnotherInputBox').comboTree({
            source: SampleJSONData1,
            isMultiple: false
        });
    });
}
