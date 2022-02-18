const { variableLengthCheck, nameInputCheck, invalidCountryInputCheck, invalidPhoneInputCheck } = require("./script");

//Testing VariableLengthCheck
test("test variabel length, too long", function ()
{
    expect(variableLengthCheck("123456789123456789123456789")).toBe(false);
});

test("test variabel length, too short", function ()
{
    expect(variableLengthCheck(12)).toBe(false);
});

test("test variabel length, valid", function ()
{
    expect(variableLengthCheck("1234567890")).toBe(true);
});

//Testing nameInputCheck
test("test name input, valid (only letters)", function ()
{
    expect(nameInputCheck("Jimmy")).toBe(true);
});

test("test name input, valid - special character", function ()
{
    expect(nameInputCheck("Karl-alfred")).toBe(true);
});

test("test name input, invalid, contains number", function ()
{
    expect(nameInputCheck("J1mmy")).toBe(false);
});

test("test name input, valid - other special character", function ()
{
    expect(nameInputCheck("d'arc")).toBe(true);
});

test("test name input, invalid - special character", function ()
{
    expect(nameInputCheck("M@rtin")).toBe(false);
});

//Testing invalidCountryInputCheck

test("test country input, valid", function ()
{
    expect(invalidCountryInputCheck("sverige")).toBe(true);
});

test("test country input, invalid - missing text", function ()
{
    expect(invalidCountryInputCheck("dnmark")).toBe(false);
});

test("test country input, invalid - uppercase", function ()
{
    expect(invalidCountryInputCheck("ICELAND")).toBe(false);
});
test("test country input, invalid - number", function ()
{
    expect(invalidCountryInputCheck("n0rway")).toBe(false);
});

//Testing invalidPhoneInputCheck

test("test phoneInputCheck, invalid - special characters", function ()
{
    expect(invalidPhoneInputCheck("0123+445")).toBe(false);
});

test("test phoneInputCheck, valid - numbers only", function ()
{
    expect(invalidPhoneInputCheck("1234565678")).toBe(true);
});

test("test phoneInputCheck, invalid - letters", function ()
{
    expect(invalidPhoneInputCheck("asdasdf")).toBe(false);
});

test("test phoneInputCheck, invalid - other special characters", function ()
{
    expect(invalidPhoneInputCheck("2´´")).toBe(false);
});
