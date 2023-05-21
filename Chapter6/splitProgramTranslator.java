public static void main(String[] args){
    try{
        if(args.length == 0) throw new RuntimeException("파일명을 입력하세요.");

        String filename = args[args.length-1];
        File input = Paths.get(filename).toFile();
        ObjectMapper mapper = new ObjectMapper();
        Order[] orders = mapper.readValue(input, Order[].class);
        if(Stream.of(args).anyMatch(arg -> "-r".equals(args)))
            System.out.println(Stream.of(orders)
                                 .filter(o -> "ready".equals(o.status))
                                 .count());
        else
            System.out.println(orders.length); 

    }catch(Exception e){
        System.err.println(e);
        System.exit(1);
    }
}


//refactoring
public static void main(String[] args){
    try{
       run(args);
    }catch(Exception e){
        System.err.println(e);
        System.exit(1);
    }
}

//refactoring stage =첫번째 단계에 변환기(commandLine) 사용하기
static long run(String[] args) throws IOException{    
    CommandLine commandLine = new CommandLine(args);
    return countOrders(commandLine);
}

private static long countOrders(CommandLine commandLine) throws IOException{
    File input = Paths.get(commandLine.filename()).toFile();
    ObjectMapper mapper = new ObjectMapper();
    Order[] orders = mapper.readValue(input, Order[].class);
    
    if(commandLine.onlyCountRead())
        return Stream.of(orders).filter(o -> "ready".equals(o.status)).count();
    else
        return orders.length; 
}


public class CommandLine{
    String[] args;

    public CommandLine(String[] args)
    {
        this.args =args;
        if(args.length == 0) throw new RuntimeException("파일명을 입력하세요.");
    }
    boolean onlyCountRead;
    String filename(){
        return args[args.length - 1];
    }
    boolean onlyCountRead(){
        return Stream.of(args).anyMatch(arg -> "-r".equals(arg));
    }
}
