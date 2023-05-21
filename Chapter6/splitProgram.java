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

static void run(String[] args) throws IOException{
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
}



//refactoring stage2  : Humble Object Pattern
public static void main(String[] args){
    try{
       System.out.println(run(args));
    }catch(Exception e){
        System.err.println(e);
        System.exit(1);
    }
}

static long run(String[] args) throws IOException{
     if(args.length == 0) throw new RuntimeException("파일명을 입력하세요.");

        String filename = args[args.length-1];
        File input = Paths.get(filename).toFile();
        ObjectMapper mapper = new ObjectMapper();
        Order[] orders = mapper.readValue(input, Order[].class);
        if(Stream.of(args).anyMatch(arg -> "-r".equals(args)))
            return Stream.of(orders).filter(o -> "ready".equals(o.status)).count();
        else
            return orders.length; 
}


//refactoring stage3 

static long run(String[] args) throws IOException{
    if(args.length == 0) throw new RuntimeException("파일명을 입력하세요.");
    String filename = args[args.length-1];
    return countOrders(args, filename)
}

private static long countOrders(String[] args, String filename) throws IOException{
    File input = Paths.get(filename).toFile();
    ObjectMapper mapper = new ObjectMapper();
    Order[] orders = mapper.readValue(input, Order[].class);
    if(Stream.of(args).anyMatch(arg -> "-r".equals(args)))
        return Stream.of(orders).filter(o -> "ready".equals(o.status)).count();
    else
        return orders.length; 
}


//refactoring stage4
static long run(String[] args) throws IOException{
    if(args.length == 0) throw new RuntimeException("파일명을 입력하세요.");
    CommandLine commandLine = new CommandLine();
    String filename = args[args.length-1];
    return countOrders(commandLine, args, filename)
}


private static long countOrders(CommandLine commandLine, String[] args, String filename) throws IOException{
    File input = Paths.get(filename).toFile();
    ObjectMapper mapper = new ObjectMapper();
    Order[] orders = mapper.readValue(input, Order[].class);
    boolean onlyCountReady =  Stream.of(args).anyMatch(arg -> "-r".equals(args));
    if(onlyCountReady)
        return Stream.of(orders).filter(o -> "ready".equals(o.status)).count();
    else
        return orders.length; 
}

private static class CommandLine{}




//refactoring stage5
static long run(String[] args) throws IOException{
    if(args.length == 0) throw new RuntimeException("파일명을 입력하세요.");
    CommandLine commandLine = new CommandLine();
    String filename = args[args.length-1];
    return countOrders(commandLine, args, filename)
}


private static long countOrders(CommandLine commandLine, String[] args, String filename) throws IOException{
    File input = Paths.get(filename).toFile();
    ObjectMapper mapper = new ObjectMapper();
    Order[] orders = mapper.readValue(input, Order[].class);
    commandLine.onlyCountReady =  Stream.of(args).anyMatch(arg -> "-r".equals(args));
    if(commandLine.onlyCountReady)
        return Stream.of(orders).filter(o -> "ready".equals(o.status)).count();
    else
        return orders.length; 
}

private static class CommandLine{
    boolean onlyCountRead;
}




//refactoring stage6
static long run(String[] args) throws IOException{
    if(args.length == 0) throw new RuntimeException("파일명을 입력하세요.");
    CommandLine commandLine = new CommandLine();
    commandLine.onlyCountReady =  Stream.of(args).anyMatch(arg -> "-r".equals(args));
    String filename = args[args.length-1];
    return countOrders(commandLine, args, filename)
}


private static long countOrders(CommandLine commandLine, String[] args, String filename) throws IOException{
    File input = Paths.get(filename).toFile();
    ObjectMapper mapper = new ObjectMapper();
    Order[] orders = mapper.readValue(input, Order[].class);
    
    if(commandLine.onlyCountReady)
        return Stream.of(orders).filter(o -> "ready".equals(o.status)).count();
    else
        return orders.length; 
}

private static class CommandLine{
    boolean onlyCountRead;
}




//refactoring stage7
static long run(String[] args) throws IOException{
    if(args.length == 0) throw new RuntimeException("파일명을 입력하세요.");
    CommandLine commandLine = new CommandLine();
    commandLine.onlyCountReady =  Stream.of(args).anyMatch(arg -> "-r".equals(args));
    commandLine.filename = args[args.length-1];
    return countOrders(commandLine)
}


private static long countOrders(CommandLine commandLine) throws IOException{
    File input = Paths.get(commandLine.filename).toFile();
    ObjectMapper mapper = new ObjectMapper();
    Order[] orders = mapper.readValue(input, Order[].class);
    
    if(commandLine.onlyCountReady)
        return Stream.of(orders).filter(o -> "ready".equals(o.status)).count();
    else
        return orders.length; 
}

private static class CommandLine{
    boolean onlyCountRead;
    String filename;
}






//refactoring stage8
static long run(String[] args) throws IOException{
    return countOrders(parseCommandLine(args))
}

private static CommandLine parseCommandLine(String[] args){
    if(args.length == 0) throw new RuntimeException("파일명을 입력하세요.");
    CommandLine result = new CommandLine();
    result.onlyCountReady =  Stream.of(args).anyMatch(arg -> "-r".equals(args));
    result.filename = args[args.length-1];
    return result;
}


private static long countOrders(CommandLine commandLine) throws IOException{
    File input = Paths.get(commandLine.filename).toFile();
    ObjectMapper mapper = new ObjectMapper();
    Order[] orders = mapper.readValue(input, Order[].class);
    
    if(commandLine.onlyCountReady)
        return Stream.of(orders).filter(o -> "ready".equals(o.status)).count();
    else
        return orders.length; 
}

private static class CommandLine{
    boolean onlyCountRead;
    String filename;
