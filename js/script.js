const { createApp } = Vue;

createApp({
    data() {
        return {
            items: [],
            edits: [],
            empty: false
        }
    },

    methods: {
        queryServer(){
            axios.get("server.php").then((res) => {
                if(res.data == "empty"){
                    this.empty = true;
                    return;
                }
                else if(this.empty)
                    this.empty = false;

                for(let i = 0; i < res.data.items.length; i++)
                    this.items.push(res.data.items[i]);
            });
        },

        sendData(){
            let data = {items: this.items};

            axios.post("server.php", data, {headers: {"Content-Type": "multipart/form-data"}}).then((res) => {
            });
        },

        sendDataEmpty(){
            let data = {empty: "string"};
            axios.post("server.php", data, {headers: {"Content-Type": "multipart/form-data"}}).then((res) => {
            });
        },

        toggleItem(index){
            if(this.items[index] != undefined){
                if(this.items[index].isDone == "true")
                    this.items[index].isDone = "false";
                else
                    this.items[index].isDone = "true";

            this.sendData();
            }
        },

        removeItem(index){
                if(this.items.length == 1){
                    this.items = [];
                    this.sendDataEmpty();
                    this.empty = true;
                }
                else{
                    this.items.splice(index, 1);
                    this.sendData();
                }
        },

        editItem(e, index){
            this.disableEditModeExcept(index);
            this.edits[index] = !this.edits[index];

            this.$nextTick(() => {let inputBox = e.target.closest("li").querySelector("input[type='text']"); inputBox.focus()});
        },

        disableEditMode(){
            for(let i = 0; i < this.edits.length; i++)
                if(this.edits[i])
                    this.edits[i] = false;
        },

        disableEditModeExcept(index){
            for(let i = 0; i < this.edits.length; i++)
                if(this.edits[i] && i != index)
                    this.edits[i] = false;
        },

        nameUpperCase(name){
            return name.toUpperCase();
        },

        changeName(e, index){
            if(this.checkInput(e.target.value)){
                this.items[index].name = e.target.value;
                this.sendData();
            
                this.disableEditMode();
            }
            else{
                e.target.value = "";
                e.target.placeholder = "Errore. Riprova...";
            }
        },

        checkInput(s){
            let result = false;
            for(let i = 0; i < s.length && !result; i++)
                if(s[i] != ' ')
                    result = true;

            return result;
        },

        addItem(e){
            let inputBox = e.target.closest("form").querySelector("input[type='text']");
            let checkBox = e.target.closest("form").querySelector("input[type='checkbox']");
            if(this.checkInput(inputBox.value)){
                this.items.push({name: inputBox.value, isDone: checkBox.checked.toString()});
                this.sendData();
                if(this.empty)
                    this.empty = false;

                inputBox.value = "";
                inputBox.placeholder = "Scrivi...";
            }
            else{
                inputBox.value = "";
                inputBox.placeholder = "Errore. Riprova...";
            }
        }
    },

    created() {
        this.queryServer();
    },
}).mount("#app");