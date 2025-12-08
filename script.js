const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Email: ', (aa) => {
    rl.question('Qual é a senha: ', (bb) => {
    
        const a = aa;
        const b = bb;

        let Mensagem = [Email, Senha];

        Mensagem.forEach(Email, Senha => {
    
            Senha = b;
            Email = a;

            let Senhacorreta = '1236353454';
            let Emailcorreto = 'Capibara123.gmail.com';

            if (Emailcorreto && Senhacorreta) {
                console.log('Logado');
            } else {
                console.log('Senha ou Email incorreto');
            }
        });
    });
});
