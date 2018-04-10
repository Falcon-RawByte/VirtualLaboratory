GetQuadraticZero = function(x_1, y_1, x_2, y_2, x_3, y_3)
{
    var a = y_1/((x_1-x_2)*(x_1-x_3)) 
        + y_2/((x_2-x_1)*(x_2-x_3))
        + y_3/((x_3-x_1)*(x_3-x_2))

    var b = -y_1*(x_2+x_3)/((x_1-x_2)*(x_1-x_3))
        -y_2*(x_1+x_3)/((x_2-x_1)*(x_2-x_3))
        -y_3*(x_1+x_2)/((x_3-x_1)*(x_3-x_2))

    var c = y_1*x_2*x_3/((x_1-x_2)*(x_1-x_3))
        + y_2*x_1*x_3/((x_2-x_1)*(x_2-x_3))
        + y_3*x_1*x_2/((x_3-x_1)*(x_3-x_2))

    var D = b*b - 4*a*c;
    return (-b - Math.sqrt(D))/(2*a);
    // y = axx + bx + c;
    // 0 = axx + bx + c;
    // D = bb - 4ac
}
