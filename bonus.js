var longestCommonPrefix = function (strs) {
let prefix = strs[0];

for (let i = 1; i < strs.length; i++) {
    while (!strs[i].startsWith(prefix)) {
    prefix = prefix.slice(0, -1);
    }
}

return prefix;
};




console.log(longestCommonPrefix(["car", "carpet", "cart"]));   
console.log(longestCommonPrefix(["dog", "racecar", "car"]));    